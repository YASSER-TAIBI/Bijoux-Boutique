import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface OrderDetails {
  orderNumber: string;
  date: string;
  total: number;
  paymentMethod: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postcode: string;
    country: string;
    phone: string;
    email: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private currentOrderSubject = new BehaviorSubject<OrderDetails | null>(null);
  currentOrder$ = this.currentOrderSubject.asObservable();

  constructor() {}

  setCurrentOrder(order: OrderDetails) {
    this.currentOrderSubject.next(order);
  }

  getCurrentOrder(): OrderDetails | null {
    return this.currentOrderSubject.value;
  }

  clearCurrentOrder() {
    this.currentOrderSubject.next(null);
  }

  generateOrderNumber(): string {
    return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  }
}
