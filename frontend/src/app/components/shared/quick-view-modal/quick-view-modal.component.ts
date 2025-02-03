import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quick-view-modal',
  templateUrl: './quick-view-modal.component.html',
  styleUrls: ['./quick-view-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class QuickViewModalComponent {
  @Input() product: any;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<{product: any, quantity: number}>();

  quantity = 1;
  currentImageIndex = 0;

  closeModal(): void {
    this.close.emit();
  }

  nextImage(): void {
    if (this.product?.images?.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
    }
  }

  previousImage(): void {
    if (this.product?.images?.length > 0) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.product.images.length - 1 
        : this.currentImageIndex - 1;
    }
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCartHandler(): void {
    this.addToCart.emit({
      product: this.product,
      quantity: this.quantity
    });
  }
}
