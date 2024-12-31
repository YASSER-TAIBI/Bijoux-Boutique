import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartModalComponent } from '../cart-modal/cart-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, CartModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isCartOpen = false;
  isMenuOpen = false;

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
}
