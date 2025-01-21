import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product, Review, braceletsProducts, ringsProducts, necklacesProducts, earringsProducts } from '../../models/product.interface';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  quantity: number = 1;
  selectedRating: number = 0;
  review: Review = {
    userName: '',
    email: '',
    rating: 0,
    comment: '',
    date: new Date()
  };
  activeTab: string = 'description';
  relatedProducts: Product[] = [];
  selectedImage: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.findProduct(id);
    });
  }

  findProduct(id: number) {
    const allProducts = [
      ...braceletsProducts,
      ...ringsProducts,
      ...necklacesProducts,
      ...earringsProducts
    ];
    
    const foundProduct = allProducts.find(p => p.id === id);
    if (foundProduct) {
      this.product = foundProduct;
      this.selectedImage = foundProduct.image;
      this.findRelatedProducts();
    }
  }

  findRelatedProducts() {
    if (!this.product) return;

    const allProducts = [
      ...braceletsProducts,
      ...ringsProducts,
      ...necklacesProducts,
      ...earringsProducts
    ];

    this.relatedProducts = allProducts
      .filter(p => p.category === this.product?.category && p.id !== this.product?.id)
      .slice(0, 4);
  }

  changeTab(tab: string) {
    this.activeTab = tab;
  }

  changeImage(image: string) {
    this.selectedImage = image;
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  setRating(rating: number) {
    this.selectedRating = rating;
    this.review.rating = rating;
  }

  submitReview() {
    if (this.review.userName && this.review.rating && this.review.comment && this.product) {
      const newReview: Review = {
        userName: this.review.userName,
        email: this.review.email,
        rating: this.review.rating,
        comment: this.review.comment,
        date: new Date()
      };

      if (!this.product.reviews) {
        this.product.reviews = [];
      }

      this.product.reviews.unshift(newReview);
      
      // Réinitialiser le formulaire
      this.review = {
        userName: '',
        email: '',
        rating: 0,
        comment: '',
        date: new Date()
      };
      this.selectedRating = 0;
    }
  }

  addToCart() {
    if (this.product) {
      console.log('Produit ajouté au panier:', {
        product: this.product,
        quantity: this.quantity
      });
    }
  }

  get averageRating(): number {
    if (!this.product?.reviews?.length) {
      return 0;
    }
    const sum = this.product.reviews.reduce((acc: number, review: Review) => acc + review.rating, 0);
    return Math.round((sum / this.product.reviews.length) * 10) / 10;
  }

  getRatingPercentage(rating: number): number {
    if (!this.product?.reviews?.length) {
      return 0;
    }
    const ratingCount = this.product.reviews.filter((review: Review) => review.rating === rating).length;
    return Math.round((ratingCount / this.product.reviews.length) * 100);
  }

  getDiscountPercentage(): number {
    if (!this.product?.oldPrice || !this.product?.price) {
      return 0;
    }
    return Math.round(((this.product.oldPrice - this.product.price) / this.product.oldPrice) * 100);
  }
}
