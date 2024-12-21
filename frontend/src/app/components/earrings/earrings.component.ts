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
  selector: 'app-earrings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './earrings.component.html',
  styleUrls: ['./earrings.component.scss']
})
export class EarringsComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Boucles d\'Oreilles Pendantes',
      price: 149.99,
      image: '../../../assets/images/Boucles_Oreilles/boucle_oreille_1.jpg'
    },
    {
      id: 2,
      name: 'Boucles d\'Oreilles Pendantes',
      price: 99.99,
      image: '../../../assets/images/Boucles_Oreilles/boucle_oreille_2.jpg'
    },
    {
      id: 3,
      name: 'Boucles d\'Oreilles Pendantes',
      price: 210.99,
      image: '../../../assets/images/Boucles_Oreilles/boucle_oreille_3.jpg'
    },
    {
      id: 4,
      name: 'Boucles d\'Oreilles Pendantes',
      price: 124.99,
      image: '../../../assets/images/Boucles_Oreilles/boucle_oreille_4.jpg'
    },
    {
      id: 5,
      name: 'Boucles d\'Oreilles Pendantes',
      price: 69.99,
      image: '../../../assets/images/Boucles_Oreilles/boucle_oreille_5.jpg'
    },
  ];
}
