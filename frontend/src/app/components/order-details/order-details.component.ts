import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { OrderService, OrderDetails } from '../../services/order.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s ease-out', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class OrderDetailsComponent implements OnInit {
  orderDetails: OrderDetails | null = null;
  showConfetti: boolean = false;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer les détails de la commande depuis le service
    this.orderDetails = this.orderService.getCurrentOrder();

    // Si aucune donnée de commande n'est disponible, rediriger vers la page d'accueil
    if (!this.orderDetails) {
      this.router.navigate(['/']);
      return;
    }

    // Déclencher l'animation de confetti
    setTimeout(() => {
      this.showConfetti = true;
    }, 500);
    
    // Sauvegarder la commande dans l'historique
    this.saveOrderToHistory();
  }

  getSubtotal(): number {
    if (!this.orderDetails?.items) return 0;
    return this.orderDetails.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  returnToHome(): void {
    this.orderService.clearCurrentOrder();
    this.router.navigate(['/']);
  }

  downloadInvoice(): void {
    if (!this.orderDetails) return;

    // Création du contenu de la facture
    const invoiceContent = `
FACTURE

Numéro de commande: ${this.orderDetails.orderNumber}
Date: ${this.orderDetails.date}

INFORMATIONS CLIENT
${this.orderDetails.customerInfo.firstName} ${this.orderDetails.customerInfo.lastName}
${this.orderDetails.customerInfo.address}
${this.orderDetails.customerInfo.postcode} ${this.orderDetails.customerInfo.city}
${this.orderDetails.customerInfo.country}
Tél: ${this.orderDetails.customerInfo.phone}
Email: ${this.orderDetails.customerInfo.email}

DÉTAILS DE LA COMMANDE
${this.orderDetails.items.map(item => 
  `${item.name} × ${item.quantity} : ${item.price.toFixed(2)}€`
).join('\n')}

Sous-total: ${this.getSubtotal().toFixed(2)}€
Mode de paiement: ${this.orderDetails.paymentMethod}
TOTAL: ${this.orderDetails.total.toFixed(2)}€
    `;

    // Création et téléchargement du fichier
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture_${this.orderDetails.orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private saveOrderToHistory(): void {
    if (!this.orderDetails) return;

    // Récupérer l'historique existant
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    
    // Ajouter la nouvelle commande
    const orderWithTimestamp = {
      ...this.orderDetails,
      timestamp: new Date().toISOString()
    };
    
    // Ajouter au début de l'historique
    orderHistory.unshift(orderWithTimestamp);
    
    // Limiter l'historique à 10 commandes
    const limitedHistory = orderHistory.slice(0, 10);
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('orderHistory', JSON.stringify(limitedHistory));
  }
}
