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
  selector: 'app-rings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rings.component.html',
  styleUrls: ['./rings.component.scss']
})
export class RingsComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Bague Solitaire',
      price: 299.99,
      image: '../../../assets/images/Bagues/bague_1.jpg'
    },
    {
      id: 2,
      name: 'Bague Solitaire',
      price: 150.00,
      image: '../../../assets/images/Bagues/bague_2.jpg'
    },
    {
      id: 3,
      name: 'Bague Solitaire',
      price: 250.00,
      image: '../../../assets/images/Bagues/bague_3.jpg'
    },
    {
      id: 4,
      name: 'Bague Solitaire',
      price: 360.50,
      image: '../../../assets/images/Bagues/bague_4.jpg'
    },
    {
      id: 5,
      name: 'Bague Solitaire',
      price: 244.99,
      image: '../../../assets/images/Bagues/bague_5.jpg'
    },
  ];
}
