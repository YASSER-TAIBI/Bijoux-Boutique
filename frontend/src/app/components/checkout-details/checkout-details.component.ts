import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerInfo } from '../../models/order.interface';

interface User {
  email: string;
  name: string;
  phone?: string;
}

@Component({
  selector: 'app-checkout-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-details.component.html',
  styleUrls: ['./checkout-details.component.scss']
})
export class CheckoutDetailsComponent implements OnInit {
  cartItems: any[] = [];
  customerInfo: CustomerInfo = {
    email: '',
    firstName: '',
    lastName: '',
    companyName: '',
    country: 'FR',
    streetAddress: '',
    apartment: '',
    postcode: '',
    city: '',
    phone: '',
    notes: '',
    paymentMethod: 'cash-delivery'
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      // Sauvegarder l'URL de redirection
      localStorage.setItem('redirectAfterLogin', '/checkout');
      this.router.navigate(['/account']);
      return;
    }

    // Récupérer les informations de l'utilisateur connecté
    this.authService.currentUser$.subscribe((user: User | null) => {
      if (user) {
        // Diviser le nom complet en prénom et nom
        const nameParts = user.name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        // Pré-remplir les informations de l'utilisateur
        this.customerInfo = {
          ...this.customerInfo,
          email: user.email,
          firstName: firstName,
          lastName: lastName,
          phone: user.phone || '',
        };
      }
    });

    // Vérifier le panier
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      if (items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  placeOrder(): void {
    if (this.validateForm()) {
      const orderDetails = {
        orderNumber: this.orderService.generateOrderNumber(),
        date: this.orderService.formatDate(new Date()),
        total: this.getSubtotal(),
        paymentMethod: this.customerInfo.paymentMethod === 'cash-delivery' ? 'Paiement à la livraison' : 'Virement bancaire',
        customerInfo: {
          firstName: this.customerInfo.firstName,
          lastName: this.customerInfo.lastName,
          address: `${this.customerInfo.streetAddress}${this.customerInfo.apartment ? ', ' + this.customerInfo.apartment : ''}`,
          city: this.customerInfo.city,
          postcode: this.customerInfo.postcode,
          country: this.customerInfo.country === 'FR' ? 'France' : this.customerInfo.country,
          phone: this.customerInfo.phone,
          email: this.customerInfo.email
        },
        items: this.cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      // Enregistrer les détails de la commande dans le service
      this.orderService.setCurrentOrder(orderDetails);
      
      // Vider le panier
      this.cartService.clearCart();
      
      // Rediriger vers la page de confirmation de commande
      this.router.navigate(['/order']);
    }
  }

  private validateForm(): boolean {
    const requiredFields: (keyof CustomerInfo)[] = [
      'email',
      'firstName',
      'lastName',
      'country',
      'streetAddress',
      'postcode',
      'city',
      'phone'
    ];

    const fieldTranslations: { [key: string]: string } = {
      email: 'Email',
      firstName: 'Prénom',
      lastName: 'Nom',
      country: 'Pays',
      streetAddress: 'Adresse',
      postcode: 'Code postal',
      city: 'Ville',
      phone: 'Téléphone'
    };

    for (const field of requiredFields) {
      if (!this.customerInfo[field]) {
        alert(`Le champ "${fieldTranslations[field]}" est requis.`);
        return false;
      }
    }

    return true;
  }
}
