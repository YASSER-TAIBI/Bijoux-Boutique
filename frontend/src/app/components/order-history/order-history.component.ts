import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { fadeSlideInAnimation } from '../../animations/shared.animations';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { OrderDetails } from '../../models/order.interface';
import { Subject, takeUntil, filter } from 'rxjs';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
  animations: [fadeSlideInAnimation]
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  orders: OrderDetails[] = [];
  filteredOrders: OrderDetails[] = [];
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

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
        filter(user => !!user) // Ne réagir que lorsqu'un utilisateur est disponible
      )
      .subscribe(user => {
        if (user?.id) {
          this.loadOrders(user.id);
        }
      });

    // Déclencher le chargement initial
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.loadOrders(userId);
    }
  }

  private loadOrders(userId: string): void {
    this.loading = true;
    this.error = null;

    this.orderService.getUserOrders(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders) => {
          this.orders = orders;
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
}
