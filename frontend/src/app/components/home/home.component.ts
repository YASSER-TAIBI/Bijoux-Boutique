import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuickViewModalComponent } from '../shared/quick-view-modal/quick-view-modal.component';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, QuickViewModalComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentTestimonialIndex = 0;
  featuredProducts: Product[] = [];
  selectedProduct: any = null;
  isQuickViewOpen = false;
  testimonials = [
    {
      text: "Des bijoux magnifiques et un service client exceptionnel !",
      author: "Sophie L.",
      role: "Cliente fidèle"
    },
    {
      text: "La qualité des matériaux est remarquable. Je recommande !",
      author: "Marie P.",
      role: "Cliente satisfaite"
    },
    {
      text: "Des pièces uniques qui ne manquent pas de faire leur effet.",
      author: "Julie M.",
      role: "Cliente régulière"
    }
  ];

  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadFeaturedProducts();
  }

  private loadFeaturedProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        // Sélectionner des produits variés (1 de chaque catégorie)
        const categories = ['Earrings', 'Necklaces', 'Bracelets', 'Rings'];
        
        // Créer un tableau temporaire pour stocker les produits sélectionnés
        let selectedProducts: Product[] = [];

        // Sélectionner un produit aléatoire pour chaque catégorie
        categories.forEach(category => {

          const categoryProducts = products.filter(p => p.category === category);
          
          if (categoryProducts.length > 0) {
            const randomProduct = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
            
            // Vérifier et s'assurer que le produit a toutes les propriétés nécessaires
            if (randomProduct) {
              // Créer une copie du produit avec les propriétés requises
              const processedProduct: Product = {
                ...randomProduct,
                images: randomProduct.images || ['/assets/images/placeholder.jpg'],
                price: randomProduct.price || 0,
                discountPrice: Math.random() > 0.7 ? 
                  +(randomProduct.price * 0.8).toFixed(2) : // 20% de réduction
                  null
              };
              
              selectedProducts.push(processedProduct);
            }
          }
        });

        // Mettre à jour featuredProducts avec les produits sélectionnés
        this.featuredProducts = selectedProducts;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  navigateToProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  nextTestimonial() {
    const testimonialCards = document.querySelector('.testimonial-cards') as HTMLElement;
    this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
    testimonialCards.style.transform = `translateX(-${this.currentTestimonialIndex * 100}%)`;
  }

  prevTestimonial() {
    const testimonialCards = document.querySelector('.testimonial-cards') as HTMLElement;
    this.currentTestimonialIndex = this.currentTestimonialIndex === 0 
      ? this.testimonials.length - 1 
      : this.currentTestimonialIndex - 1;
    testimonialCards.style.transform = `translateX(-${this.currentTestimonialIndex * 100}%)`;
  }

  openQuickView(product: any): void {
    this.selectedProduct = product;
    this.isQuickViewOpen = true;
  }

  closeQuickView(): void {
    this.isQuickViewOpen = false;
    this.selectedProduct = null;
  }

  handleAddToCart(event: {product: Product, quantity: number}): void {
    this.cartService.addToCart(event.product, event.quantity);
  }
}
