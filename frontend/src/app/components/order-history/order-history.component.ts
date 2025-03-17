import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { fadeSlideInAnimation } from '../../animations/shared.animations';

interface OrderHistory {
  id: string;
  orderNumber: string;
  status: string;
  items: item[];
  purchaseDate: Date;
  totalPrice: number;
}

interface item {
  productImage: string;
  productName: string;
  sellerName: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
  animations: [fadeSlideInAnimation]
})
export class OrderHistoryComponent implements OnInit {
  orders: OrderHistory[] = [
    {
      id: '1',
      orderNumber: '90500088907037',
      status: 'Complete',
      items: [{
      productImage: 'assets/images/products/ea-sports-fc24.jpg',
      productName: 'EA SPORTS FC 24 (Xbox Series X/S)',
      sellerName: 'Gamebooth',
      quantity: 1,
      price: 17.63
      },
      {
        productImage: 'assets/images/products/gta5.jpg',
        productName: 'Grand Theft Auto V | Premium Edition (Xbox One)',
        sellerName: 'Kinguin',
        quantity: 1,
        price: 12.30
        },
      ],
      purchaseDate: new Date('2024-01-20T18:14:00'),
      totalPrice: 29.93
    },
    {
      id: '2',
      orderNumber: '90500089981078',
      status: 'Complete',
      items: [{
      productImage: 'assets/images/products/gta5.jpg',
      productName: 'Grand Theft Auto V | Premium Edition (Xbox One)',
      sellerName: 'Kinguin',
      quantity: 1,
      price: 12.30
      }],
      purchaseDate: new Date('2024-02-04T17:58:00'),
      totalPrice: 17.63
    }
  ];

  constructor() {}

  ngOnInit() {
    // Les données d'exemple sont déjà chargées
  }

  viewOrderDetails(orderId: string) {
    console.log('Viewing order details for ID:', orderId);
  }
}
