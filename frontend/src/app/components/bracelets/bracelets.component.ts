import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-bracelets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bracelets.component.html',
  styleUrls: ['./bracelets.component.scss']
})
export class BraceletsComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Bracelet Tennis',
      price: 99.99,
      image: '../../../assets/images/Bracelets/bracelet_1.jpg'
    },
    {
      id: 2,
      name: 'Bracelet Tennis',
      price: 44.99,
      image: '../../../assets/images/Bracelets/bracelet_2.jpg'
    },
    {
      id: 3,
      name: 'Bracelet Tennis',
      price: 110.00,
      image: '../../../assets/images/Bracelets/bracelet_3.jpg'
    },
    {
      id: 4,
      name: 'Bracelet Tennis',
      price: 150.50,
      image: '../../../assets/images/Bracelets/bracelet_4.jpg'
    },
  ];
}
