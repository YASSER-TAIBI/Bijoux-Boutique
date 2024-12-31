import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Product, Review, earringsProducts } from '../../models/product.interface';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  selectedImage: string = '';
  quantity: number = 1;
  activeTab: string = 'description';
  rating: number = 5;
  relatedProducts: Product[] = [];
  review: Review = {
    userName: '',
    email: '',
    rating: 5,
    comment: '',
    date: new Date()
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.product = earringsProducts.find(p => p.id === productId);
      if (this.product) {
        this.selectedImage = this.product.image;
        this.loadRelatedProducts(productId);
      }
    });
  }

  changeImage(image: string): void {
    this.selectedImage = image;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  incrementQuantity(): void {
    if (this.product && this.product.quantity && this.quantity < this.product.quantity) {
      this.quantity++;
    }
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }

  setRating(rating: number): void {
    this.rating = rating;
  }

  isRatingActive(index: number): boolean {
    return index <= this.rating;
  }

  getRatingPercentage(stars: number): number {
    if (!this.product || !this.product.reviews) return 0;
    const totalReviews = this.product.reviews.length;
    if (totalReviews === 0) return 0;
    
    const starsCount = this.product.reviews.filter(r => r.rating === stars).length;
    return Math.round((starsCount / totalReviews) * 100);
  }

  submitReview(): void {
    if (this.product && this.product.reviews) {
      const newReview: Review = {
        id: this.product.reviews.length + 1,
        userName: this.review.userName,
        email: this.review.email,
        rating: this.rating,
        comment: this.review.comment,
        date: new Date()
      };

      this.product.reviews.push(newReview);

      // Réinitialiser le formulaire
      this.review = {
        userName: '',
        email: '',
        rating: 5,
        comment: '',
        date: new Date()
      };
      this.rating = 5;
    }
  }

  loadRelatedProducts(currentProductId: string) {
    // Filtrer les produits pour exclure le produit actuel et limiter à 4 produits
    this.relatedProducts = earringsProducts
      .filter(product => product.id !== currentProductId)
      .slice(0, 4);
  }
}
