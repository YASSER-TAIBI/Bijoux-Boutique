import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalProducts: number = 0;
  totalOrders: number = 0;
  totalRevenue: number = 0;
  lowStockProducts: number = 0;
  recentOrders: any[] = [];
  bestSellingProducts: any[] = [];
  
  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.initCharts();
  }

  loadDashboardData(): void {
    // Charger le nombre total de produits
    this.productService.getProducts().subscribe(products => {
      this.totalProducts = products.length;
      this.lowStockProducts = products.filter(p => (p.quantity || 0) < 5).length;
    });

    // Charger les commandes récentes et les statistiques
    this.orderService.getBestSellers().subscribe(data => {
      this.bestSellingProducts = data.slice(0, 5);
    });

    // Simuler des données pour la démonstration
    this.totalOrders = 124;
    this.totalRevenue = 15780;
    this.recentOrders = [
      { orderNumber: '2025-0001', date: new Date(), customer: 'Sophie Martin', total: 189.99, status: 'Livrée' },
      { orderNumber: '2025-0002', date: new Date(), customer: 'Thomas Dubois', total: 245.50, status: 'En cours' },
      { orderNumber: '2025-0003', date: new Date(), customer: 'Emma Leroy', total: 129.99, status: 'En attente' },
      { orderNumber: '2025-0004', date: new Date(), customer: 'Lucas Bernard', total: 349.95, status: 'Expédiée' }
    ];
  }

  initCharts(): void {
    setTimeout(() => {
      this.createSalesChart();
      this.createCategoryChart();
    }, 500);
  }

  createSalesChart(): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (!ctx) return;
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: [{
          label: 'Ventes (€)',
          data: [1200, 1900, 1500, 2000, 2400, 1800, 2200, 2600, 2300, 2800, 3000, 3200],
          borderColor: '#4e73df',
          backgroundColor: 'rgba(78, 115, 223, 0.05)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  createCategoryChart(): void {
    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!ctx) return;
    
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Bagues', 'Bracelets', 'Colliers', 'Boucles d\'oreilles'],
        datasets: [{
          data: [35, 25, 20, 20],
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
          hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a'],
          hoverBorderColor: 'rgba(234, 236, 244, 1)',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        cutout: '70%'
      }
    });
  }
}
