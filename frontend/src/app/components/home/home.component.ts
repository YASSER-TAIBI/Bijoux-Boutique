import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  featuredProducts = [
    {
      name: 'Bague Diamant Solitaire',
      price: 1299.99,
      image: 'assets/images/products/ring1.jpg'
    },
    {
      name: 'Collier Or Rose',
      price: 899.99,
      image: 'assets/images/products/necklace1.jpg'
    },
    {
      name: 'Bracelet Tennis Diamants',
      price: 2499.99,
      image: 'assets/images/products/bracelet1.jpg'
    },
    {
      name: 'Boucles d\'Oreilles Perles',
      price: 799.99,
      image: 'assets/images/products/earrings1.jpg'
    }
  ];
}
