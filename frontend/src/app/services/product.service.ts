import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  // Alias pour getProduct pour une meilleure lisibilité
  getProductById(id: string): Observable<Product> {
    return this.getProduct(id);
  }
}
