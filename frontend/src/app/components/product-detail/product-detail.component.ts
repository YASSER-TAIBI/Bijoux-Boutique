import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product, Review } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { ViewportScroller } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { fadeSlideInAnimation } from '../../animations/shared.animations';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  animations: [fadeSlideInAnimation]
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

  constructor(
    private route: ActivatedRoute, 
    private productService: ProductService, 
    private viewportScroller: ViewportScroller,
    private toastr: ToastrService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.findProduct(id);
    });

    // Remonter en haut de la page après navigation
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  findProduct(id: string) {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        if (product) {
          this.product = product;
          this.selectedImage = product.image;
          this.findRelatedProducts();
        } else {
          this.toastr.error('Produit non trouvé');
          this.viewportScroller.scrollToPosition([0, 0]);
        }
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement du produit');
        console.error('Erreur lors du chargement du produit:', error);
      }
    });
  }

  findRelatedProducts() {
    if (!this.product) return;

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.relatedProducts = products
          .filter(p => 
            p.category === this.product?.category && 
            p._id !== this.product?._id
          )
          .slice(0, 4);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits similaires:', error);
      }
    });
  }

  changeTab(tab: string) {
    this.activeTab = tab;
  }

  changeImage(image: string) {
    this.selectedImage = image;
  }

  incrementQuantity() {
    if (this.quantity < 5) {
      this.quantity++;
    } else {
      this.toastr.warning('Maximum 5 articles par commande');
    }
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
    if (!this.review.userName || !this.review.email || !this.review.rating || !this.review.comment) {
      this.toastr.warning('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.product) {
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
      this.toastr.success('Merci pour votre avis !');
      
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
      
      this.toastr.success(`${this.product.name} ajouté au panier`);
      this.quantity = 1;
    }
  }

  toggleFavorite(productId: string) {
    if (this.isFavorite(productId)) {
      this.wishlistService.removeFromWishlist(productId).subscribe({
        next: () => {
          this.toastr.success('Produit retiré des favoris');
        },
        error: () => {
          this.toastr.error('Erreur lors du retrait des favoris');
        }
      });
    } else {
      this.wishlistService.addToWishlist(productId).subscribe({
        next: () => {
          this.toastr.success('Produit ajouté aux favoris');
        },
        error: () => {
          this.toastr.error('Erreur lors de l\'ajout aux favoris');
        }
      });
    }
  }

  isFavorite(productId: string): boolean {
    return this.wishlistService.isInWishlist(productId);
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
