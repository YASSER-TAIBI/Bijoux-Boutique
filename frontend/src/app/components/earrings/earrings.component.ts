import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { earringsProducts } from '../../models/product.interface';

@Component({
  selector: 'app-earrings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './earrings.component.html',
  styleUrls: ['./earrings.component.scss']
})
export class EarringsComponent {
  products = earringsProducts;
  sortOptions = [
    { value: 'default', label: 'Tri par défaut' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'name-asc', label: 'Nom, A à Z' },
    { value: 'name-desc', label: 'Nom, Z à A' }
  ];

  selectedSort = 'default';

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedSort = select.value;
    this.sortProducts();
  }

  sortProducts(): void {
    switch (this.selectedSort) {
      case 'price-asc':
        this.products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.products.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        this.products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Restaurer l'ordre par défaut
        this.products = [...earringsProducts];
    }
  }
}
