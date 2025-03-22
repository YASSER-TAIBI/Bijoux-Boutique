import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { fadeSlideInAnimation } from '../../animations/shared.animations';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { OrderDetails } from '../../models/order.interface';
import { Subject, takeUntil, filter, forkJoin } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
  animations: [
    fadeSlideInAnimation,
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  orders: OrderDetails[] = [];
  filteredOrders: OrderDetails[] = [];
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();
  productImages = new Map<string, string>();
  expandedOrderId: string | null = null;

  // Filtres et tri
  searchTerm = '';
  sortOption: 'date' | 'price' | 'status' = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';
  statusFilter = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/order-history' }
      });
      return;
    }

    // S'abonner aux changements de l'utilisateur
    this.authService.currentUser$
      .pipe(
        takeUntil(this.destroy$),
        filter(user => !!user) 
      )
      .subscribe(user => {
        if (user?.id) {
          this.loadOrders(user.id);
        }
      });
  }

  private loadOrders(userId: string): void {
    this.loading = true;
    this.error = null;

    this.orderService.getUserOrders(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders) => {
          this.orders = orders;
          this.loadProductImages(orders);
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des commandes:', err);
          this.error = 'Impossible de charger vos commandes. Veuillez réessayer plus tard.';
          this.loading = false;
        }
      });
  }

  private loadProductImages(orders: OrderDetails[]): void {
    const productIds = new Set<string>();
    orders.forEach(order => {
      order.items.forEach(item => {
        productIds.add(item.productId);
      });
    });

    const productRequests = Array.from(productIds).map(id =>
      this.productService.getProduct(id).pipe(
        takeUntil(this.destroy$)
      )
    );

    if (productRequests.length > 0) {
      forkJoin(productRequests).subscribe({
        next: (products) => {
          products.forEach(product => {
            if (product && product._id) {
              this.productImages.set(product._id, product.image);
            }
          });
          // Forcer la mise à jour de la vue
          this.filteredOrders = [...this.filteredOrders];
        },
        error: (err) => {
          console.error('Erreur lors du chargement des images:', err);
        }
      });
    }
  }

  getProductImage(productId: string): string {
    const image = this.productImages.get(productId);
    if (image) {
      return image;
    } else {
      // Si l'image n'est pas encore chargée, on utilise l'URL directe
      return `../../../assets/images/products/picture-not-available.jpg`;
    }
  }

  onImageError(event: any): void {
    event.target.src = '../../../assets/images/products/picture-not-available.jpg';
    event.target.classList.add('error');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters(): void {
    let result = [...this.orders];

    // Filtre par recherche
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      result = result.filter(order => 
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(searchLower)
        )
      );
    }

    // Filtre par statut
    if (this.statusFilter !== 'all') {
      result = result.filter(order => 
        order.status.toLowerCase() === this.statusFilter.toLowerCase()
      );
    }

    // Tri
    result.sort((a, b) => {
      let comparison = 0;
      switch (this.sortOption) {
        case 'date':
          comparison = new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
          break;
        case 'price':
          comparison = a.totalPrice - b.totalPrice;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.filteredOrders = result;
    this.updatePagination();
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    if (this.currentPage < 1) this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getOrderStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'en cours':
        return 'pending';
      case 'expédiée':
        return 'shipped';
      case 'livrée':
        return 'delivered';
      default:
        return '';
    }
  }

  retry(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.loadOrders(userId);
    } else {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/order-history' }
      });
    }
  }

  toggleOrderDetails(orderId: string, event: Event): void {
    event.preventDefault();
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  isOrderExpanded(orderId: string): boolean {
    return this.expandedOrderId === orderId;
  }
}
