import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';
  private tokenKey = 'auth_token';
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    // On ne charge plus le profil automatiquement ici
    const token = this.getToken();
    if (token) {
      console.log('Token trouvé dans le localStorage');
    } else {
      console.log('Aucun token trouvé dans le localStorage');
    }
  }

  register(userData: any): Observable<AuthResponse> {
    console.log('Envoi de la requête d\'inscription:', userData);
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        console.log('Réponse d\'inscription reçue:', response);
        if (response.token) {
          this.setToken(response.token);
          this.userSubject.next(response.user);
          // Pas besoin de charger le profil ici car on a déjà les données de l'utilisateur
        }
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    console.log('Envoi de la requête de connexion:', credentials);
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('Réponse de connexion reçue:', response);
        if (response.token) {
          this.setToken(response.token);
          this.userSubject.next(response.user);
          // Pas besoin de charger le profil ici car on a déjà les données de l'utilisateur
        }
      })
    );
  }

  logout(): void {
    console.log('Déconnexion de l\'utilisateur');
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  setToken(token: string): void {
    console.log('Stockage du token dans le localStorage');
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserProfile(): Observable<User> {
    console.log('Récupération du profil utilisateur');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    
    return this.http.get<User>(`${this.apiUrl}/profile`, { headers }).pipe(
      tap(user => {
        console.log('Profil utilisateur reçu:', user);
        this.userSubject.next(user);
      })
    );
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }
}
