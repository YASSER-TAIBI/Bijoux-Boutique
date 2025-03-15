import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';

interface User {
  id?: string;
  email: string;
  name: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    // Vérifier s'il y a un token au démarrage
    if (this.tokenService.hasToken()) {
      this.getUserProfile().subscribe();
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        console.log('Login response:', response); // Debug log
        if (response.token) {
          this.tokenService.setToken(response.token);
          // Charger le profil immédiatement après la connexion
          this.getUserProfile().subscribe();
        }
      }),
      catchError(error => {
        console.error('Erreur de connexion:', error);
        return throwError(() => error);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response: any) => {
        console.log('Register response:', response); // Debug log
        if (response.token) {
          this.tokenService.setToken(response.token);
          // Charger le profil immédiatement après l'inscription
          this.getUserProfile().subscribe();
        }
      }),
      catchError(error => {
        console.error('Erreur d\'inscription:', error);
        return throwError(() => error);
      })
    );
  }

  getUserProfile(): Observable<any> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap(user => {
        console.log('Profile loaded:', user);
        // Vérifier que l'ID utilisateur est présent
        if (!user.id) {
          console.error('ID utilisateur manquant dans la réponse:', user);
        }
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.tokenService.hasToken();
  }

  getCurrentUserId(): string | null {
    const currentUser = this.currentUserSubject.getValue();
    console.log('Current user:', currentUser); // Debug log
    if (!currentUser?.id) {
      console.error('ID utilisateur non disponible:', currentUser);
      // Essayer de recharger le profil
      this.getUserProfile().subscribe();
    }
    return currentUser?.id || null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }
}
