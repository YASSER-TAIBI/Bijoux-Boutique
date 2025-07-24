import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

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
    
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        // Vérifier si l'utilisateur est connecté
        if (!user) {
          console.log('🚫 Accès refusé: Utilisateur non connecté');
          this.router.navigate(['/account']);
          return false;
        }

        // Vérifier si l'utilisateur a le rôle admin
        if (user.role !== 'admin') {
          console.log('🚫 Accès refusé: Rôle insuffisant -', user.role);
          this.router.navigate(['/unauthorized']);
          return false;
        }

        console.log('✅ Accès autorisé: Admin -', user.name);
        return true;
      })
    );
  }
}
