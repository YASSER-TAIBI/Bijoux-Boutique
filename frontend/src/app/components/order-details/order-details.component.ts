import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

interface OrderDetails {
  orderNumber: string;
  date: string;
  total: number;
  paymentMethod: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postcode: string;
    country: string;
    phone: string;
    email: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

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
  orderDetails: OrderDetails = {
    orderNumber: '1216',
    date: '28 Février 2025',
    total: 3750.00,
    paymentMethod: 'Paiement à la livraison',
    customerInfo: {
      firstName: 'Yasser',
      lastName: 'TAIBI',
      address: '131 rue antoine charial',
      city: 'LYON',
      postcode: '69003',
      country: 'France',
      phone: '+33768132016',
      email: 'yasser.taibi.19@gmail.com'
    },
    items: [
      {
        name: 'Product Name 10',
        quantity: 2,
        price: 3400.00
      },
      {
        name: 'Product Name 12',
        quantity: 1,
        price: 350.00
      }
    ]
  };

  showConfetti: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si aucune donnée de commande n'est disponible, rediriger vers la page d'accueil
    if (!this.orderDetails) {
      this.router.navigate(['/']);
    } else {
      // Déclencher l'animation de confetti
      this.showConfetti = true;
      
      // Sauvegarder la commande dans l'historique
      this.saveOrderToHistory();
    }
  }

  getSubtotal(): number {
    return this.orderDetails.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  returnToHome(): void {
    this.router.navigate(['/']);
  }

  downloadInvoice(): void {
    // Simulation du téléchargement de la facture
    const invoiceContent = `
Facture N° ${this.orderDetails.orderNumber}
Date: ${this.orderDetails.date}
------------------------------------------
Client: ${this.orderDetails.customerInfo.firstName} ${this.orderDetails.customerInfo.lastName}
Adresse: ${this.orderDetails.customerInfo.address}
         ${this.orderDetails.customerInfo.postcode} ${this.orderDetails.customerInfo.city}
         ${this.orderDetails.customerInfo.country}
------------------------------------------
${this.orderDetails.items.map(item => 
  `${item.name} x${item.quantity}: ${item.price.toFixed(2)}€`
).join('\n')}
------------------------------------------
Total: ${this.orderDetails.total.toFixed(2)}€
    `;

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
