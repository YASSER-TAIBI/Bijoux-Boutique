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
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
        datasets: [{
          label: 'Sales',
          data: [20, 35, 25, 45, 30, 55, 40, 65, 50, 70, 60, 80, 75, 85, 80],
          borderColor: '#4dabf7',
          backgroundColor: 'rgba(77, 171, 247, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 6,
          borderWidth: 3
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
            display: false,
            beginAtZero: true
          },
          x: {
            display: false
          }
        },
        elements: {
          point: {
            radius: 0
          }
        }
      }
    });
  }

  createCategoryChart(): void {
    const ctx = document.getElementById('profitsChart') as HTMLCanvasElement;
    if (!ctx) return;
    
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Direct', 'Social', 'Other'],
        datasets: [{
          data: [50, 25, 25],
          backgroundColor: ['#ff6b6b', '#4dabf7', '#ffd700'],
          borderWidth: 0
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
        cutout: '70%'
      }
    });
  }
}
