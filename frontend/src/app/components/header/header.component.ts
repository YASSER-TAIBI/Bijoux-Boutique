import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CartModalComponent } from '../cart-modal/cart-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, CartModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isCartOpen = false;
  isMenuOpen = false;
  cartCount = 0;
  currentUser: any = null;

  constructor(private authService: AuthService, public cartService: CartService) {}

  ngOnInit() {
    console.log('Header Component Initialized');
    console.log('Is Logged In:', this.authService.isLoggedIn());
    console.log('Token:', this.authService.getToken());
    // Vérifier si un utilisateur est connecté au chargement du composant
    this.updateUserStatus();
    this.cartService.cartItems$.subscribe(() => {
      this.cartCount = this.cartService.getCartCount();
    });
  }

  updateUserStatus() {
    console.log('Updating user status...');
    if (this.authService.isLoggedIn()) {
      console.log('User is logged in');
      // Récupérer les informations de l'utilisateur depuis le localStorage
      const token = this.authService.getToken();
      if (token) {
        try {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          // Récupérer les informations complètes de l'utilisateur
          this.authService.getUserProfile().subscribe({
            next: (user) => {
              console.log('User profile received:', user);
              this.currentUser = user;
            },
            error: (error) => {
              console.error('Error getting user profile:', error);
              this.logout();
            }
          });
        } catch (error) {
          console.error('Erreur lors du décodage du token:', error);
          this.logout();
        }
      }
    } else {
      console.log('User is not logged in');
      this.currentUser = null;
    }
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }

  closeCart() {
    this.isCartOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  toggleDropdown(event: Event) {
    if (window.innerWidth <= 768) {
      event.preventDefault();
      const dropdownContent = (event.target as HTMLElement).nextElementSibling as HTMLElement;
      const dropdown = (event.target as HTMLElement).parentElement;
      
      if (dropdown) {
        dropdown.classList.toggle('active');
      }
      
      if (dropdownContent) {
        dropdownContent.classList.toggle('show');
      }
    }
  }

  logout() {
    console.log('Logging out...');
    this.authService.logout();
    this.currentUser = null;
    window.location.reload(); // Recharger la page pour réinitialiser l'état
  }
}
