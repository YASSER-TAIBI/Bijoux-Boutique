import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { fadeSlideInAnimation } from '../../animations/shared.animations';

@Component({
  selector: 'app-view-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './view-cart.component.html',
  styleUrls: ['./view-cart.component.scss'],
  animations: [fadeSlideInAnimation]
})
export class ViewCartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.cartService.removeFromCart(productId);
    } else {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  removeItem(productId: string): void {
    const item = this.cartItems.find(item => item._id === productId);
    if (item) {
      this.cartService.removeFromCart(productId);
      this.toastr.success(`${item.name} a été retiré du panier`);
    }
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      this.toastr.warning('Votre panier est vide');
      return;
    }

    if (this.authService.isLoggedIn()) {
      console.log('Utilisateur connecté, redirection vers checkout');
      this.router.navigate(['/checkout']);
    } else {
      this.toastr.info('Veuillez vous connecter pour continuer');
      localStorage.setItem('redirectAfterLogin', '/checkout');
      this.router.navigate(['/account']);
    }
  }
}
