import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-necklaces',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './necklaces.component.html',
  styleUrls: ['./necklaces.component.scss']
})
export class NecklacesComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Collier Étoile Filante',
      price: 950.00,
      image: '../../../assets/images/Colliers/collier_1.jpg'
    },
    {
      id: 2,
      name: 'Collier Perle de Lune',
      price: 890.00,
      image: '../../../assets/images/Colliers/collier_2.jpg'
    },
    {
      id: 3,
      name: 'Collier Goutte d\'Or',
      price: 1250.00,
      image: '../../../assets/images/Colliers/collier_3.jpg'
    },
    {
      id: 4,
      name: 'Collier Cristal Royal',
      price: 1450.00,
      image: '../../../assets/images/Colliers/collier_4.jpg'
    },
    {
      id: 5,
      name: 'Collier Papillon d\'Argent',
      price: 750.00,
      image: '../../../assets/images/Colliers/collier_5.jpg'
    },
    {
      id: 6,
      name: 'Collier Rose Dorée',
      price: 1150.00,
      image: '../../../assets/images/Colliers/collier_6.jpg'
    },
    {
      id: 7,
      name: 'Collier Rose Dorée',
      price: 550.00,
      image: '../../../assets/images/Colliers/collier_7.jpg'
    }
  ];
}
