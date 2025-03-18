import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { fadeSlideInAnimation } from '../../animations/shared.animations';

interface OrderHistory {
  id: string;
  orderNumber: string;
  status: string;
  items: Item[];
  purchaseDate: Date;
  totalPrice: number;
}

interface Item {
  productImage: string;
  productName: string;
  category: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
  animations: [fadeSlideInAnimation]
})
export class OrderHistoryComponent implements OnInit {
  allOrders: OrderHistory[] = [
    {
      id: '1',
      orderNumber: '90500088907037',
      status: 'Complete',
      items: [{
        productImage: '../../../assets/images/Boucles_Oreilles/boucle_oreille_1.jpg',
        productName: 'Boucles d\'Oreilles Diamant Étoilé',
        category: 'Boucles d\'Oreilles',
        quantity: 1,
        price: 17.63
      },
      {
        productImage: '../../../assets/images/Bagues/bague_1.jpg',
        productName: 'Bague Solitaire Diamant',
        category: 'Bagues',
        quantity: 1,
        price: 12.30
      }],
      purchaseDate: new Date('2024-01-20T18:14:00'),
      totalPrice: 29.93
    },
    {
      id: '2',
      orderNumber: '90500089981078',
      status: 'Complete',
      items: [{
        productImage: '../../../assets/images/Bracelets/bracelet_4.jpg',
        productName: 'Bracelet Multi-Rangs Cuir',
        category: 'Bracelets',
        quantity: 1,
        price: 12.30
      }],
      purchaseDate: new Date('2024-02-04T17:58:00'),
      totalPrice: 12.30
    }
  ];

  // Filtres et tri
  orders: OrderHistory[] = [];
  searchTerm: string = '';
  sortOption: 'date' | 'price' | 'status' = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';
  statusFilter: string = 'all';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor() {}

  ngOnInit() {
    this.orders = [...this.allOrders];
    this.applyFilters();
  }

  // Méthodes de filtrage et tri
  applyFilters() {
    let filteredOrders = [...this.allOrders];

    // Recherche
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredOrders = filteredOrders.filter(order => 
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.items.some(item => 
          item.productName.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower)
        )
      );
    }

    // Filtre par statut
    if (this.statusFilter !== 'all') {
      filteredOrders = filteredOrders.filter(order => 
        order.status.toLowerCase() === this.statusFilter.toLowerCase()
      );
    }

    // Tri
    filteredOrders.sort((a, b) => {
      let comparison = 0;
      switch (this.sortOption) {
        case 'date':
          comparison = a.purchaseDate.getTime() - b.purchaseDate.getTime();
          break;
        case 'price':
          comparison = a.totalPrice - b.totalPrice;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return this.sortDirection === 'desc' ? -comparison : comparison;
    });

    // Mise à jour de la pagination
    this.totalPages = Math.ceil(filteredOrders.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    if (this.currentPage === 0 && this.totalPages > 0) this.currentPage = 1;

    // Application de la pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.orders = filteredOrders.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Méthodes de pagination
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Méthodes de tri et filtrage
  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  viewOrderDetails(orderId: string) {
    console.log('Viewing order details for ID:', orderId);
  }
}
