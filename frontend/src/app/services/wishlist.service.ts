import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/users/wishlist`;
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
        this.wishlistItems.next(wishlist);
      })
    );
  }

  removeFromWishlist(productId: string): Observable<string[]> {
    return this.http.delete<string[]>(`${this.apiUrl}/${productId}`).pipe(
      tap(wishlist => {
        this.wishlistItems.next(wishlist);
      })
    );
  }

  isInWishlist(productId: string): boolean {
    const currentWishlist = this.wishlistItems.value;
    const isInList = currentWishlist.includes(productId);
    return isInList;
  }
}
