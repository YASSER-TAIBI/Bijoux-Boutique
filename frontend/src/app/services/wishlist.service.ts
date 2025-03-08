import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `http://localhost:3000/api/users/wishlist`;
  private wishlistItems = new BehaviorSubject<string[]>([]);
  wishlistItems$ = this.wishlistItems.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Charger les favoris si l'utilisateur est connecté
    if (this.authService.isLoggedIn()) {
      this.loadWishlist();
    }

    // S'abonner aux changements d'état de connexion
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadWishlist();
      } else {
        this.wishlistItems.next([]);
      }
    });
  }

  loadWishlist() {
    this.http.get<string[]>(this.apiUrl).subscribe({
      next: (items) => {
        this.wishlistItems.next(items);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des favoris:', error);
      }
    });
  }

  addToWishlist(productId: string): Observable<any> {
    return this.http.post(this.apiUrl, { productId });
  }

  removeFromWishlist(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`);
  }

  isInWishlist(productId: string): boolean {
    const isInWishlist = this.wishlistItems.value.includes(productId);
    return isInWishlist;
  }
}
