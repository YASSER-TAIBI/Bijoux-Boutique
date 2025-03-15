import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { OrderDetails, OrderItem } from '../../models/order.interface';
import { trigger, transition, style, animate } from '@angular/animations';

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
  order: OrderDetails | null = null;
  showConfetti: boolean = false;
  userName: string = '';
  userPhone: string = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.order = this.orderService.getCurrentOrder();
    if (!this.order) {
      this.router.navigate(['/account']);
      return;
    }

    // Récupérer les informations de l'utilisateur
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.name;
        this.userPhone = user.phone || '';
      }
    });

    // Afficher l'animation de confetti
    setTimeout(() => {
      this.showConfetti = true;
      // Cacher l'animation après 3 secondes
      // setTimeout(() => {
      //   this.showConfetti = false;
      // }, 3000);
    }, 500);
    
    // Sauvegarder la commande dans l'historique
    this.saveOrderToHistory();
  }

  getSubtotal(): number {
    if (!this.order) return 0;
    return this.order.items.reduce((total: number, item: OrderItem) => total + (item.price * item.quantity), 0);
  }

  getFormattedDate(date: Date): string {
    return this.orderService.formatDate(new Date(date));
  }

  returnToHome(): void {
    this.orderService.clearCurrentOrder();
    this.router.navigate(['/']);
  }

  downloadInvoice(): void {
    if (!this.order) return;

    // Création du contenu de la facture
    const invoiceContent = `
FACTURE

Numéro de commande: ${this.order.orderNumber}
Date: ${this.getFormattedDate(this.order.orderDate)}

INFORMATIONS DE LIVRAISON
${this.userName}
${this.order.shippingAddress.street}
${this.order.shippingAddress.zip} ${this.order.shippingAddress.city}
${this.order.shippingAddress.country}
${this.userPhone ? 'Tél: ' + this.userPhone : ''}

DÉTAILS DE LA COMMANDE
${this.order.items.map(item => 
  `${item.name} × ${item.quantity} : ${item.price.toFixed(2)}€`
).join('\n')}

Mode de paiement: ${this.order.paymentMethod}
TOTAL: ${this.order.totalPrice.toFixed(2)}€
    `;

    // Création et téléchargement du fichier
    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture_${this.order.orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private saveOrderToHistory(): void {
    if (!this.order) return;

    // Récupérer l'historique existant
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');

    // Ajouter la nouvelle commande
    const orderWithTimestamp = {
      ...this.order,
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
