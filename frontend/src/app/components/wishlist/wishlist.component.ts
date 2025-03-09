import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.interface';
import { firstValueFrom } from 'rxjs';

interface WishlistProduct extends Product {
  selected?: boolean;
}

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
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
    private router: Router
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
          this.error = 'Une erreur est survenue lors du chargement de vos favoris.';
          this.loading = false;
        });
      },
      error: (error: Error) => {
        console.error('Erreur lors de la récupération de la wishlist:', error);
        this.error = 'Une erreur est survenue lors du chargement de vos favoris.';
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
    } catch (error) {
      console.error('Erreur lors de la suppression des produits:', error);
      this.error = 'Une erreur est survenue lors de la suppression des produits.';
    }
  }

  removeFromWishlist(productId: string) {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.wishlistProducts = this.wishlistProducts.filter(p => p._id !== productId);
      },
      error: (error: Error) => {
        console.error('Erreur lors de la suppression du favori:', error);
        this.error = 'Une erreur est survenue lors de la suppression du produit.';
      }
    });
  }

  async addToCart(product: Product) {
    // try {
    //   await firstValueFrom(this.cartService.addToCart(product));
    //   // Optionnel : retirer le produit des favoris après l'ajout au panier
    //   await firstValueFrom(this.wishlistService.removeFromWishlist(product._id));
    //   this.wishlistProducts = this.wishlistProducts.filter(p => p._id !== product._id);
    // } catch (error) {
    //   console.error('Erreur lors de l\'ajout au panier:', error);
    //   this.error = 'Une erreur est survenue lors de l\'ajout au panier.';
    // }
  }

  goToProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }
}
