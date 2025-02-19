import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-rings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './rings.component.html',
  styleUrls: ['./rings.component.scss']
})
export class RingsComponent implements OnInit {
  rings: Product[] = [];
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
    this.getRings();
  }

  getRings() {
    this.productService.getProducts().subscribe(products => {
      this.rings = products.filter(product => product.category === 'Rings');
    });
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedSort = select.value;
    this.sortProducts();
  }

  sortProducts(): void {
    switch (this.selectedSort) {
      case 'price-asc':
        this.rings.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.rings.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        this.rings.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.rings.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Restaurer l'ordre par défaut
        this.rings = [...this.rings];
    }
  }
}
