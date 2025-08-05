import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take, filter, timeout, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Vérifier d'abord s'il y a un token
    if (!this.authService.isLoggedIn()) {
      console.log('🚫 Accès refusé: Aucun token');
      this.router.navigate(['/account']);
      return false;
    }

    // Si il y a un token, attendre que le profil soit chargé
    return this.authService.currentUser$.pipe(
      filter(user => user !== null), // Attendre que l'utilisateur soit chargé
      take(1),
      map((user: User) => {
        // Vérifier si l'utilisateur a le rôle admin
        if (user!.role !== 'admin') {
          console.log('🚫 Accès refusé: Rôle insuffisant -', user!.role);
          this.router.navigate(['/unauthorized']);
          return false;
        }

        console.log('✅ Accès autorisé: Admin -', user!.name);
        return true;
      }),
      timeout(5000), // Timeout de 5 secondes
      catchError((error: any) => {
        console.error('❌ Erreur lors de la vérification admin:', error);
        this.router.navigate(['/account']);
        return of(false);
      })
    );
  }
}
