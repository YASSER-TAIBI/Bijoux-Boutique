import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Product, earringsProducts } from '../../models/product.interface';

@Component({
  selector: 'app-earrings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './earrings.component.html',
  styleUrls: ['./earrings.component.scss']
})
export class EarringsComponent {
  products: Product[] = earringsProducts;

  constructor(private router: Router) {}

  navigateToProduct(productId: number) {
    console.log('Navigating to product:', productId);
    this.router.navigate(['/product', productId]);
  }
}
