import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { ToastrService } from 'ngx-toastr';
import { CustomerInfo, OrderDetails, OrderItem } from '../../models/order.interface';
import { fadeSlideInAnimation } from '../../animations/shared.animations';

interface User {
  id?: string;
  email: string;
  name: string;
  phone?: string;
}

@Component({
  selector: 'app-checkout-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-details.component.html',
  styleUrls: ['./checkout-details.component.scss'],
  animations: [fadeSlideInAnimation]
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
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      this.toastr.warning('Veuillez vous connecter pour accéder au checkout');
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
    return this.cartItems.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
  }

  placeOrder(): void {
    if (!this.validateForm()) {
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user || !user.id) {
      this.toastr.warning('Veuillez vous connecter pour continuer');
      localStorage.setItem('redirectAfterLogin', '/checkout');
      this.router.navigate(['/account']);
      return;
    }

    const orderDetails: OrderDetails = {
      orderNumber: this.orderService.generateOrderNumber(),
      userId: user.id,
      items: this.cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalPrice: this.getSubtotal(),
      status: 'En cours',
      orderDate: new Date(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Date de livraison estimée à 7 jours
      paymentMethod: this.customerInfo.paymentMethod === 'cash-delivery' ? 'Paiement à la livraison' : 'Virement bancaire',
      shippingAddress: {
        street: `${this.customerInfo.streetAddress}${this.customerInfo.apartment ? ', ' + this.customerInfo.apartment : ''}`,
        city: this.customerInfo.city,
        zip: this.customerInfo.postcode,
        country: this.customerInfo.country === 'FR' ? 'France' : this.customerInfo.country
      }
    };

    // Enregistrer la commande
    this.orderService.createOrder(orderDetails).subscribe({
      next: (savedOrder) => {
        this.cartService.clearCart();
        this.toastr.success('Votre commande a été créée avec succès !');
        this.router.navigate(['/order'], {
          queryParams: { orderId: savedOrder._id }
        });
      },
      error: (error) => {
        console.error('Erreur lors de la création de la commande:', error);
        this.toastr.error('Une erreur est survenue lors de la création de la commande. Veuillez réessayer.');
      }
    });
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
        this.toastr.warning(`Le champ "${fieldTranslations[field]}" est requis.`);
        return false;
      }
    }

    return true;
  }
}
