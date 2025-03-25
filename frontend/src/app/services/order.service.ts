import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { OrderDetails } from '../models/order.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  private currentOrderSubject = new BehaviorSubject<OrderDetails | null>(null);
  currentOrder$ = this.currentOrderSubject.asObservable();

  constructor(private http: HttpClient) {}

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

  // Nouvelles méthodes pour l'API
  createOrder(orderDetails: OrderDetails): Observable<OrderDetails> {
    return this.http.post<OrderDetails>(this.apiUrl, orderDetails).pipe(
      tap(order => {
        this.setCurrentOrder(order);
      })
    );
  }

  getUserOrders(userId: string): Observable<OrderDetails[]> {
    return this.http.get<OrderDetails[]>(`${this.apiUrl}/user/${userId}`);
  }

  getBestSellers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/best-sellers`);
  }

  getOrderById(orderId: string): Observable<OrderDetails> {
    return this.http.get<OrderDetails>(`${this.apiUrl}/${orderId}`);
  }

  updateOrderStatus(orderId: string, status: string): Observable<OrderDetails> {
    return this.http.patch<OrderDetails>(`${this.apiUrl}/${orderId}/status`, { status });
  }
}
