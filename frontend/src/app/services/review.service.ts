import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  _id?: string;
  userName: string;
  email: string;
  rating: number;
  comment: string;
  date: Date;
  productId?: string;
  userId?: string;
  isVerified?: boolean;
  isVisible?: boolean;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export interface RatingStats {
  [key: number]: {
    count: number;
    percentage: number;
  };
}

export interface ReviewResponse {
  success: boolean;
  reviews?: Review[];
  review?: Review;
  statistics?: ReviewStats;
  ratingStats?: RatingStats;
  totalReviews?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:3000/api/reviews';

  constructor(private http: HttpClient) { }

  // Créer un nouvel avis
  createReview(reviewData: {
    userName: string;
    email: string;
    rating: number;
    comment: string;
    productId?: string;
  }): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(this.apiUrl, reviewData);
  }

  // Récupérer les avis d'un produit
  getProductReviews(productId: string): Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(`${this.apiUrl}/product/${productId}`);
  }

  // Récupérer les statistiques de notation d'un produit
  getProductRatingStats(productId: string): Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(`${this.apiUrl}/product/${productId}/stats`);
  }

  // Calculer la note moyenne à partir des avis
  calculateAverageRating(reviews: Review[]): number {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10; // Arrondi à 1 décimale
  }

  // Calculer le pourcentage pour chaque note
  calculateRatingPercentages(reviews: Review[]): RatingStats {
    const stats: RatingStats = {};
    const totalReviews = reviews.length;

    // Initialiser toutes les notes à 0
    for (let i = 1; i <= 5; i++) {
      stats[i] = { count: 0, percentage: 0 };
    }

    if (totalReviews === 0) return stats;

    // Compter les avis par note
    reviews.forEach(review => {
      if (stats[review.rating]) {
        stats[review.rating].count++;
      }
    });

    // Calculer les pourcentages
    for (let i = 1; i <= 5; i++) {
      stats[i].percentage = Math.round((stats[i].count / totalReviews) * 100);
    }

    return stats;
  }

  // Formater une date pour l'affichage
  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // === MÉTHODES ADMIN ===

  // Récupérer tous les avis (admin)
  getAllReviews(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/reviews`, {
      headers: this.getAuthHeaders()
    });
  }

  // Mettre à jour la visibilité d'un avis (admin)
  updateReviewVisibility(reviewId: string, isVisible: boolean): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/admin/reviews/${reviewId}/visibility`, 
      { isVisible },
      { headers: this.getAuthHeaders() }
    );
  }

  // Supprimer un avis (admin)
  deleteReview(reviewId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/reviews/${reviewId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtenir les en-têtes d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
