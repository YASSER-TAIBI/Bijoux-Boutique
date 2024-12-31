export interface Review {
  id?: number;
  userName: string;
  email: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  category: string;
  image: string;
  images?: string[];
  inStock: boolean;
  quantity?: number;
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
  material?: string;
  dimensions?: string;
  weight?: string;
  features?: string[];
  style?: string;
  occasion?: string;
  warranty?: string;
  careInstructions?: string;
}

export const earringsProducts: Product[] = [
  {
    id: '1',
    name: 'Boucles d\'Oreilles Diamant Étoilé',
    price: 299.99,
    oldPrice: 349.99,
    description: 'Magnifiques boucles d\'oreilles en or blanc 18 carats serties de diamants naturels taille brillant. Un design élégant qui capture la lumière à chaque mouvement.',
    category: 'Earrings',
    image: '../../../assets/images/Boucles_Oreilles/boucle_oreille_1.jpg',
    images: [
      '../../../assets/images/Boucles_Oreilles/boucle_oreille_2.jpg',
      '../../../assets/images/Boucles_Oreilles/boucle_oreille_3.jpg',
      '../../../assets/images/Boucles_Oreilles/boucle_oreille_4.jpg'
    ],
    inStock: true,
    quantity: 5,
    rating: 4.8,
    reviewCount: 10,
    material: 'Or blanc 18 carats, Diamants naturels',
    dimensions: '1.5 cm x 1.5 cm',
    weight: '3.2g',
    features: ['Fermoir poussette sécurisé', 'Certificat d\'authenticité inclus'],
    style: 'Élégant',
    occasion: 'Soirée, Mariage, Occasion spéciale',
    warranty: '1 an de garantie limitée',
    careInstructions: 'Nettoyer avec un chiffon doux. Éviter le contact avec l\'eau et les produits chimiques.',
    reviews: [
      {
        id: 1,
        userName: 'Sophie L.',
        email: 'sophie@example.com',
        rating: 5,
        comment: 'Des boucles d\'oreilles absolument magnifiques ! Elles capturent la lumière de manière incroyable.',
        date: new Date('2024-11-15')
      },
      {
        id: 2,
        userName: 'Emma R.',
        email: 'emma@example.com',
        rating: 4,
        comment: 'Très élégantes et confortables à porter.',
        date: new Date('2024-11-20')
      }
    ]
  },
  {
    id: '2',
    name: 'Créoles Torsadées Or Rose',
    price: 199.99,
    description: 'Créoles torsadées en or rose 18 carats. Un design contemporain qui allie élégance et modernité, parfait pour toutes les occasions.',
    category: 'Earrings',
    image: '../../../assets/images/Boucles_Oreilles/boucle_oreille_2.jpg',
    inStock: true,
    quantity: 8,
    rating: 4.6,
    reviewCount: 5,
    material: 'Or rose 18 carats',
    dimensions: 'Diamètre: 2.5 cm',
    weight: '4.1g',
    features: ['Fermoir clip sécurisé', 'Finition polie miroir'],
    style: 'Contemporain',
    occasion: 'Toutes les occasions',
    warranty: '1 an de garantie limitée',
    careInstructions: 'Nettoyer avec un chiffon doux. Éviter le contact avec l\'eau et les produits chimiques.',
    reviews: [
      {
        id: 3,
        userName: 'Aurélie M.',
        email: 'aurelie@example.com',
        rating: 4,
        comment: 'Des créoles très élégantes et modernes.',
        date: new Date('2024-11-18')
      }
    ]
  },
  {
    id: '3',
    name: 'Puces Perles de Tahiti',
    price: 449.99,
    oldPrice: 499.99,
    description: 'Élégantes puces d\'oreilles ornées de véritables perles de Tahiti. La beauté naturelle des perles noires s\'harmonise parfaitement avec l\'or blanc.',
    category: 'Earrings',
    image: '../../../assets/images/Boucles_Oreilles/boucle_oreille_3.jpg',
    inStock: true,
    quantity: 3,
    rating: 5.0,
    reviewCount: 2,
    material: 'Or blanc 18 carats, Perles de Tahiti',
    dimensions: 'Perle: 8-9mm',
    weight: '2.8g',
    features: ['Fermoir à vis', 'Certificat d\'origine des perles'],
    style: 'Élégant',
    occasion: 'Soirée, Mariage, Occasion spéciale',
    warranty: '1 an de garantie limitée',
    careInstructions: 'Nettoyer avec un chiffon doux. Éviter le contact avec l\'eau et les produits chimiques.',
    reviews: [
      {
        id: 4,
        userName: 'Léa G.',
        email: 'lea@example.com',
        rating: 5,
        comment: 'Des puces d\'oreilles absolument magnifiques ! Les perles de Tahiti sont de très haute qualité.',
        date: new Date('2024-11-22')
      }
    ]
  },
  {
    id: '4',
    name: 'Pendants Cascade Saphir',
    price: 599.99,
    description: 'Magnifiques pendants en or blanc sertis de saphirs bleus et de diamants. Une cascade étincelante qui illuminera votre visage.',
    category: 'Earrings',
    image: '../../../assets/images/Boucles_Oreilles/boucle_oreille_4.jpg',
    inStock: true,
    quantity: 2,
    rating: 4.9,
    reviewCount: 1,
    material: 'Or blanc 18 carats, Saphirs, Diamants',
    dimensions: 'Longueur: 3.5 cm',
    weight: '5.2g',
    features: ['Fermoir dorsal sécurisé', 'Écrin luxe inclus'],
    style: 'Élégant',
    occasion: 'Soirée, Mariage, Occasion spéciale',
    warranty: '1 an de garantie limitée',
    careInstructions: 'Nettoyer avec un chiffon doux. Éviter le contact avec l\'eau et les produits chimiques.',
    reviews: [
      {
        id: 5,
        userName: 'Anaïs D.',
        email: 'anais@example.com',
        rating: 5,
        comment: 'Des pendants absolument incroyables ! La cascade de saphirs et de diamants est vraiment étincelante.',
        date: new Date('2024-11-25')
      }
    ]
  },
  {
    id: '5',
    name: 'Créoles Diamants Infini',
    price: 799.99,
    oldPrice: 899.99,
    description: 'Créoles serties de diamants sur toute la face externe, symbolisant l\'infini. Un bijou intemporel qui ne passera jamais de mode.',
    category: 'Earrings',
    image: '../../../assets/images/Boucles_Oreilles/boucle_oreille_5.jpg',
    inStock: true,
    quantity: 4,
    rating: 4.7,
    reviewCount: 3,
    material: 'Or blanc 18 carats, Diamants',
    dimensions: 'Diamètre: 2 cm',
    weight: '4.8g',
    features: ['Fermoir clip avec sécurité', 'Certificat diamants'],
    style: 'Élégant',
    occasion: 'Soirée, Mariage, Occasion spéciale',
    warranty: '1 an de garantie limitée',
    careInstructions: 'Nettoyer avec un chiffon doux. Éviter le contact avec l\'eau et les produits chimiques.',
    reviews: [
      {
        id: 6,
        userName: 'Charlotte B.',
        email: 'charlotte@example.com',
        rating: 4,
        comment: 'Des créoles très élégantes et modernes.',
        date: new Date('2024-11-28')
      }
    ]
  }
];
