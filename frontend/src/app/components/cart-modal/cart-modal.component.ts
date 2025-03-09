import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss']
})
export class CartModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeCart = new EventEmitter<void>();

  cartItems: CartItem[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
    });
  }

  onClose() {
    this.closeCart.emit();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.cartService.removeFromCart(productId);
    } else {
      this.cartService.updateQuantity(productId, quantity);
      }
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  viewCart(): void {
    this.closeCart.emit();
    this.router.navigate(['/cart']);
  }

  checkout(): void {
    this.closeCart.emit();
    this.router.navigate(['/checkout']);
  }
}
