import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CartModalComponent } from '../cart-modal/cart-modal.component';
import { Router } from '@angular/router';

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
  isDropdownOpen = false;

  constructor(
    private authService: AuthService,
    public cartService: CartService,
    private router: Router
  ) {
    // S'abonner aux changements d'état de l'utilisateur
    this.authService.currentUser$.subscribe(user => {
      console.log('User state changed:', user);
      this.currentUser = user;
    });
  }

  ngOnInit() {
    console.log('Header Component Initialized');
    console.log('Is Logged In:', this.authService.isLoggedIn());
    console.log('Token:', this.authService.getToken());
    // Charger l'utilisateur au démarrage
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        console.log('Profile loaded in header:', user);
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error loading profile in header:', error);
      }
    });
    this.cartService.cartItems$.subscribe(() => {
      this.cartCount = this.cartService.getCartCount();
    });
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
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  logout() {
    console.log('Logging out...');
    this.authService.logout();
    this.currentUser = null;
    this.router.navigate(['/']);
  }
}
