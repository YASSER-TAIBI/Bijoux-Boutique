import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './view-cart.component.html',
  styleUrls: ['./view-cart.component.scss']
})
export class ViewCartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  decrementQuantity(item: any): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item, item.quantity - 1);
    }
  }

  incrementQuantity(item: any): void {
    this.cartService.updateQuantity(item, item.quantity + 1);
  }

  updateQuantity(event: any, item: any): void {
    const newQuantity = parseInt(event.target.value);
    if (newQuantity > 0) {
      this.cartService.updateQuantity(item, newQuantity);
    }
  }

  removeItem(item: any): void {
    this.cartService.removeFromCart(item);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
