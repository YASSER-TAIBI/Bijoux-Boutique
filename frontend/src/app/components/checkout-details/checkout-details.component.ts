import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  country: string;
  streetAddress: string;
  apartment: string;
  postcode: string;
  city: string;
  phone: string;
  notes: string;
  paymentMethod: 'bank-transfer' | 'cash-delivery';
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
    private router: Router
  ) {}

  ngOnInit(): void {
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
      // Ici, vous pouvez ajouter la logique pour envoyer la commande au backend
      console.log('Commande passée:', {
        customerInfo: this.customerInfo,
        items: this.cartItems,
        sousTotal: this.getSubtotal(),
        total: this.getSubtotal()
      });
      
      // Vider le panier
      // this.cartService.clearCart();
      
      // Rediriger vers la page de confirmation
      // this.router.navigate(['/order-complete']);
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
      email: "l'adresse e-mail",
      firstName: 'le prénom',
      lastName: 'le nom',
      country: 'le pays',
      streetAddress: "l'adresse",
      postcode: 'le code postal',
      city: 'la ville',
      phone: 'le numéro de téléphone'
    };

    for (const field of requiredFields) {
      if (!this.customerInfo[field]) {
        alert(`Veuillez remplir ${fieldTranslations[field]}`);
        return false;
      }
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.customerInfo.email)) {
      alert("Veuillez entrer une adresse e-mail valide");
      return false;
    }

    // Validation du numéro de téléphone (format français)
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    if (!phoneRegex.test(this.customerInfo.phone)) {
      alert("Veuillez entrer un numéro de téléphone valide");
      return false;
    }

    // Validation du code postal français
    const postcodeRegex = /^[0-9]{5}$/;
    if (!postcodeRegex.test(this.customerInfo.postcode)) {
      alert("Veuillez entrer un code postal valide (5 chiffres)");
      return false;
    }

    return true;
  }

  viewCart(): void {
    this.router.navigate(['/cart']);
  }
}
