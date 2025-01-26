import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-necklaces',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './necklaces.component.html',
  styleUrls: ['./necklaces.component.scss']
})
export class NecklacesComponent {
  necklaces: Product[] = [];
  sortOptions = [
    { value: 'default', label: 'Tri par défaut' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'name-asc', label: 'Nom, A à Z' },
    { value: 'name-desc', label: 'Nom, Z à A' }
  ];

  selectedSort = 'default';

  constructor(private productService: ProductService) {}
  
  ngOnInit() {
    this.getNecklaces();
  }

  getNecklaces() {
    const allProducts = [...this.productService.Products];
    this.necklaces = allProducts.filter(product => product.category === 'Necklaces');
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedSort = select.value;
    this.sortProducts();
  }

  sortProducts(): void {
    switch (this.selectedSort) {
      case 'price-asc':
        this.necklaces.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.necklaces.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        this.necklaces.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.necklaces.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Restaurer l'ordre par défaut
        this.necklaces = [...this.necklaces];
    }
  }
}
