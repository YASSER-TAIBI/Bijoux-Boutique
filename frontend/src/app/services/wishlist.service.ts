import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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
    if (this.authService.isLoggedIn()) {
      this.loadWishlist();
    }

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
        console.log('Wishlist chargée:', items);
        this.wishlistItems.next(items || []);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des favoris:', error);
        this.wishlistItems.next([]);
      }
    });
  }

  addToWishlist(productId: string): Observable<string[]> {
    return this.http.post<string[]>(this.apiUrl, { productId }).pipe(
      tap(wishlist => {
        console.log('Wishlist après ajout:', wishlist);
        this.wishlistItems.next(wishlist);
      })
    );
  }

  removeFromWishlist(productId: string): Observable<string[]> {
    return this.http.delete<string[]>(`${this.apiUrl}/${productId}`).pipe(
      tap(wishlist => {
        console.log('Wishlist après suppression:', wishlist);
        this.wishlistItems.next(wishlist);
      })
    );
  }

  isInWishlist(productId: string): boolean {
    const currentWishlist = this.wishlistItems.value;
    const isInList = currentWishlist.includes(productId);
    console.log('Vérification wishlist pour', productId, ':', isInList, 'Liste actuelle:', currentWishlist);
    return isInList;
  }
}
