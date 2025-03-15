import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.interface';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { fadeSlideInAnimation } from '../../animations/shared.animations';

interface WishlistProduct extends Product {
  selected?: boolean;
}

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
  animations: [fadeSlideInAnimation]
})
export class WishlistComponent implements OnInit {
  wishlistProducts: WishlistProduct[] = [];
  loading: boolean = true;
  error: string | null = null;
  selectAll: boolean = false;

  constructor(
    private wishlistService: WishlistService,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadWishlistProducts();
  }

  loadWishlistProducts() {
    this.loading = true;
    this.error = null;

    this.wishlistService.wishlistItems$.subscribe({
      next: (wishlistIds) => {
        if (wishlistIds.length === 0) {
          this.wishlistProducts = [];
          this.loading = false;
          return;
        }

        // Charger les détails de chaque produit
        Promise.all(
          wishlistIds.map(id => 
            firstValueFrom(this.productService.getProductById(id))
              .catch((error: Error) => {
                console.error(`Erreur lors du chargement du produit ${id}:`, error);
                return null;
              })
          )
        ).then(products => {
          this.wishlistProducts = products
            .filter((product): product is Product => product !== null)
            .map(product => ({ ...product, selected: false }));
          this.loading = false;
        }).catch((error: Error) => {
          console.error('Erreur lors du chargement des produits:', error);
          this.toastr.error('Une erreur est survenue lors du chargement de vos favoris');
          this.loading = false;
        });
      },
      error: (error: Error) => {
        console.error('Erreur lors de la récupération de la wishlist:', error);
        this.toastr.error('Une erreur est survenue lors du chargement de vos favoris');
        this.loading = false;
      }
    });
  }

  toggleSelectAll() {
    this.wishlistProducts.forEach(product => {
      product.selected = this.selectAll;
    });
  }

  hasSelectedItems(): boolean {
    return this.wishlistProducts.some(product => product.selected);
  }

  async deleteSelected() {
    const selectedProducts = this.wishlistProducts.filter(product => product.selected);

    try {
      // Supprimer chaque produit sélectionné
      await Promise.all(
        selectedProducts.map(product =>
          firstValueFrom(this.wishlistService.removeFromWishlist(product._id))
        )
      );
      
      // Mettre à jour la liste locale
      this.wishlistProducts = this.wishlistProducts.filter(product => !product.selected);
      this.selectAll = false;
      
      if (selectedProducts.length === 1) {
        this.toastr.success('Le produit a été retiré de vos favoris');
      } else {
        this.toastr.success(`${selectedProducts.length} produits ont été retirés de vos favoris`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression des produits:', error);
      this.toastr.error('Une erreur est survenue lors de la suppression des produits');
    }
  }

  removeFromWishlist(productId: string) {
    const product = this.wishlistProducts.find(p => p._id === productId);
    if (!product) return;

    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.wishlistProducts = this.wishlistProducts.filter(p => p._id !== productId);
        this.toastr.success(`${product.name} a été retiré de vos favoris`);
      },
      error: (error: Error) => {
        console.error('Erreur lors de la suppression du favori:', error);
        this.toastr.error('Une erreur est survenue lors de la suppression du produit');
      }
    });
  }

  async addToCart(product: WishlistProduct) {
    try {
      this.cartService.addToCart(product);
      await firstValueFrom(this.wishlistService.removeFromWishlist(product._id));
      this.wishlistProducts = this.wishlistProducts.filter(p => p._id !== product._id);
      
      this.toastr.success(`${product.name} a été ajouté au panier`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      this.toastr.error('Une erreur est survenue lors de l\'ajout au panier');
    }
  }

  goToProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }
}
