import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductAdminService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Récupérer tous les produits (public)
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Récupérer un produit par ID (public)
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les produits par catégorie (public)
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
  }

  // Rechercher des produits (public)
  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`);
  }

  // Créer un nouveau produit (admin uniquement)
  createProduct(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/admin`, product, {
      headers: this.getAuthHeaders()
    });
  }

  // Mettre à jour un produit (admin uniquement)
  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/admin/${id}`, product, {
      headers: this.getAuthHeaders()
    });
  }

  // Supprimer un produit (admin uniquement)
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
