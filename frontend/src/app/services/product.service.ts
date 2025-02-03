import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  Products: Product[] = [
    {
      id: 1,
      name: 'Boucles d\'Oreilles Diamant Étoilé',
      price: 299.99,
      oldPrice: 349.99,
      description: 'Magnifiques boucles d\'oreilles en or blanc 18 carats serties de diamants naturels taille brillant. Un design élégant qui capture la lumière à chaque mouvement.',
      detailDescription: 'Diamants naturels taille brillant. Idéale pour une tenue sophistiquee. Élégant bracelet jonc en or blanc serti de diamants naturels taille brillant. Idéal pour une tenue sophistiquée.',
      category: 'Earrings',
      frenchCategory: 'Boucles d\'Oreilles',
      image: '../../../assets/images/Boucles_Oreilles/boucle_oreille_1.jpg',
      images: [
        '../../../assets/images/Boucles_Oreilles/boucle_oreille_1.jpg',
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
      id: 2,
      name: 'Créoles Torsadées Or Rose',
      price: 199.99,
      description: 'Créoles torsadées en or rose 18 carats. Un design contemporain qui allie élégance et modernité, parfait pour toutes les occasions.',
      detailDescription: 'Diamants naturels taille brillant. Idéale pour une tenue sophistiquee. Élégant bracelet jonc en or blanc serti de diamants naturels taille brillant. Idéal pour une tenue sophistiquée.',
      category: 'Earrings',
      frenchCategory: 'Boucles d\'Oreilles',
      image: '../../../assets/images/Boucles_Oreilles/boucle_oreille_2.jpg',
      images: [
        '../../../assets/images/Boucles_Oreilles/boucle_oreille_2.jpg',
        '../../../assets/images/Boucles_Oreilles/boucle_oreille_1.jpg',
        '../../../assets/images/Boucles_Oreilles/boucle_oreille_3.jpg',
        '../../../assets/images/Boucles_Oreilles/boucle_oreille_4.jpg'
      ],
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
      id: 3,
      name: 'Puces Perles de Tahiti',
      price: 449.99,
      oldPrice: 499.99,
      description: 'Élégantes puces d\'oreilles ornées de véritables perles de Tahiti. La beauté naturelle des perles noires s\'harmonise parfaitement avec l\'or blanc.',
      detailDescription: 'Diamants naturels taille brillant. Idéale pour une tenue sophistiquee. Élégant bracelet jonc en or blanc serti de diamants naturels taille brillant. Idéal pour une tenue sophistiquée.',
      category: 'Earrings',
      frenchCategory: 'Boucles d\'Oreilles',
      image: '../../../assets/images/Boucles_Oreilles/boucle_oreille_3.jpg',
      images: [
        '../../../assets/images/Boucles_Oreilles/boucle_oreille_3.jpg',
        '../../../assets/images/Boucles_Oreilles/boucle_oreille_1.jpg',
        '../../../assets/images/Boucles_Oreilles/boucle_oreille_2.jpg',
        '../../../assets/images/Boucles_Oreilles/boucle_oreille_4.jpg'
      ],
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
      id: 4,
      name: 'Pendants Cascade Saphir',
      price: 599.99,
      description: 'Magnifiques pendants en or blanc sertis de saphirs bleus et de diamants. Une cascade étincelante qui illuminera votre visage.',
      detailDescription: 'Diamants naturels taille brillant. Idéale pour une tenue sophistiquee. Élégant bracelet jonc en or blanc serti de diamants naturels taille brillant. Idéal pour une tenue sophistiquée.',
      category: 'Earrings',
      frenchCategory: 'Boucles d\'Oreilles',
      image: '../../../assets/images/Boucles_Oreilles/boucle_oreille_4.jpg',
      images: [
        '../../../assets/images/Boucles_Oreilles/boucle_oreille_4.jpg',
        '../../../assets/images/Boucles_Oreilles/boucle_oreille_1.jpg',
        '../../../assets/images/Boucles_Oreilles/boucle_oreille_2.jpg',
        '../../../assets/images/Boucles_Oreilles/boucle_oreille_3.jpg'
      ],
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
      id: 5,
      name: 'Créoles Diamants Infini',
      price: 799.99,
      oldPrice: 899.99,
      description: 'Créoles serties de diamants sur toute la face externe, symbolisant l\'infini. Un bijou intemporel qui ne passera jamais de mode.',
      detailDescription: 'Diamants naturels taille brillant. Idéale pour une tenue sophistiquee. Élégant bracelet jonc en or blanc serti de diamants naturels taille brillant. Idéal pour une tenue sophistiquée.',
      category: 'Earrings',
      frenchCategory: 'Boucles d\'Oreilles',
      image: '../../../assets/images/Boucles_Oreilles/boucle_oreille_5.jpg',
      images: [
        '../../../assets/images/Boucles_Oreilles/boucle_oreille_5.jpg',
        '../../../assets/images/Boucles_Oreilles/boucle_oreille_1.jpg',
        '../../../assets/images/Boucles_Oreilles/boucle_oreille_2.jpg',
        '../../../assets/images/Boucles_Oreilles/boucle_oreille_3.jpg'
      ],
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
    },
    {
      id: 6,
      name: 'Bracelet Jonc Diamanté',
      price: 499.99,
      oldPrice: 599.99,
      description: 'Élégant bracelet jonc en or blanc serti de diamants naturels taille brillant. Idéal pour une tenue sophistiquée.',
      detailDescription: 'Diamants naturels taille brillant. Idéale pour une tenue sophistiquee. Élégant bracelet jonc en or blanc serti de diamants naturels taille brillant. Idéal pour une tenue sophistiquée.',
      category: 'Bracelets',
      frenchCategory: 'Bracelets',
      image: '../../../assets/images/Bracelets/bracelet_1.jpg',
      images: [
        '../../../assets/images/Bracelets/bracelet_1.jpg',
        '../../../assets/images/Bracelets/bracelet_4.jpg',
        '../../../assets/images/Bracelets/bracelet_2.jpg',
        '../../../assets/images/Bracelets/bracelet_3.jpg'
      ],
      inStock: true,
      quantity: 3,
      rating: 4.9,
      reviewCount: 8,
      material: 'Or blanc 18 carats, Diamants naturels',
      dimensions: 'Diamètre: 6 cm',
      weight: '12g',
      features: ['Fermeture sécurisée', 'Design intemporel'],
      style: 'Classique',
      occasion: 'Mariage, Soirée',
      warranty: '2 ans de garantie limitée',
      careInstructions: 'Nettoyer délicatement avec un chiffon doux.',
      reviews: [
        {
          id: 1,
          userName: 'Pauline F.',
          email: 'pauline@example.com',
          rating: 5,
          comment: 'Magnifique bracelet, je l\'adore !',
          date: new Date('2024-12-01')
        }
      ]
    },
    {
      id: 7,
      name: 'Bracelet Gourmette Or Rose',
      price: 249.99,
      description: 'Bracelet gourmette en or rose 18 carats avec gravure personnalisable. Un bijou chic et discret.',
      detailDescription: 'Diamants naturels taille brillant. Idéale pour une tenue sophistiquee. Élégant bracelet jonc en or blanc serti de diamants naturels taille brillant. Idéal pour une tenue sophistiquée.',
      category: 'Bracelets',
      frenchCategory: 'Bracelets',
      image: '../../../assets/images/Bracelets/bracelet_2.jpg',
      images: [
        '../../../assets/images/Bracelets/bracelet_2.jpg',
        '../../../assets/images/Bracelets/bracelet_1.jpg',
        '../../../assets/images/Bracelets/bracelet_4.jpg',
        '../../../assets/images/Bracelets/bracelet_3.jpg'
      ],
      inStock: true,
      quantity: 5,
      rating: 4.7,
      reviewCount: 4,
      material: 'Or rose 18 carats',
      dimensions: 'Longueur: 18 cm',
      weight: '10g',
      features: ['Gravure personnalisable', 'Finition polie'],
      style: 'Minimaliste',
      occasion: 'Anniversaire, Quotidien',
      warranty: '1 an de garantie',
      careInstructions: 'Éviter l\'exposition prolongée à l\'eau et aux produits chimiques.',
      reviews: [
        {
          id: 2,
          userName: 'Julien T.',
          email: 'julien@example.com',
          rating: 4,
          comment: 'Un beau bijou, parfait pour un cadeau.',
          date: new Date('2024-11-28')
        }
      ]
    },
    {
      id: 8,
      name: 'Bracelet Charms Perles',
      price: 159.99,
      description: 'Bracelet extensible orné de perles d\'eau douce et de charms plaqués or.',
      detailDescription: 'Diamants naturels taille brillant. Idéale pour une tenue sophistiquee. Élégant bracelet jonc en or blanc serti de diamants naturels taille brillant. Idéal pour une tenue sophistiquée.',
      category: 'Bracelets',
      frenchCategory: 'Bracelets',
      image: '../../../assets/images/Bracelets/bracelet_3.jpg',
      images: [
        '../../../assets/images/Bracelets/bracelet_3.jpg',
        '../../../assets/images/Bracelets/bracelet_1.jpg',
        '../../../assets/images/Bracelets/bracelet_2.jpg',
        '../../../assets/images/Bracelets/bracelet_4.jpg'
      ],
      inStock: true,
      quantity: 10,
      rating: 4.5,
      reviewCount: 7,
      material: 'Perles d\'eau douce, Plaqué or',
      dimensions: 'Tour de poignet : 17-19 cm',
      weight: '8g',
      features: ['Charms interchangeables', 'Élastique ajustable'],
      style: 'Décontracté',
      occasion: 'Quotidien, Cadeau',
      warranty: '6 mois de garantie',
      careInstructions: 'Essuyer avec un chiffon doux après usage.',
      reviews: [
        {
          id: 3,
          userName: 'Elise R.',
          email: 'elise@example.com',
          rating: 5,
          comment: 'Les perles sont très jolies et brillantes !',
          date: new Date('2024-11-25')
        }
      ]
    },
    {
      id: 9,
      name: 'Bracelet Multi-Rangs Cuir',
      price: 89.99,
      description: 'Bracelet multi-rangs en cuir véritable avec fermoir magnétique en acier inoxydable.',
      detailDescription: 'Diamants naturels taille brillant. Idéale pour une tenue sophistiquee. Élégant bracelet multi-rangs en cuir véritable avec fermoir magnétique en acier inoxydable.',
      category: 'Bracelets',
      frenchCategory: 'Bracelets',
      image: '../../../assets/images/Bracelets/bracelet_4.jpg',
      images: [
        '../../../assets/images/Bracelets/bracelet_4.jpg',
        '../../../assets/images/Bracelets/bracelet_1.jpg',
        '../../../assets/images/Bracelets/bracelet_2.jpg',
        '../../../assets/images/Bracelets/bracelet_3.jpg'
      ],
      inStock: true,
      quantity: 15,
      rating: 4.6,
      reviewCount: 6,
      material: 'Cuir véritable, Acier inoxydable',
      dimensions: 'Longueur : 20 cm',
      weight: '15g',
      features: ['Fermoir magnétique', 'Design moderne'],
      style: 'Casual',
      occasion: 'Quotidien',
      warranty: '1 an de garantie',
      careInstructions: 'Éviter l\'exposition prolongée à l\'humidité.',
      reviews: [
        {
          id: 4,
          userName: 'Mathieu G.',
          email: 'mathieu@example.com',
          rating: 4,
          comment: 'Style moderne et facile à porter.',
          date: new Date('2024-12-02')
        }
      ]
    },
    {
      id: 10,
      name: 'Collier Pendentif Diamant',
      price: 799.99,
      oldPrice: 899.99,
      description: 'Collier en or blanc 18 carats avec un pendentif serti d\'un diamant taille brillant. Élégance et raffinement.',
      detailDescription: 'Diamants naturels taille brillant. Idéale pour une tenue sophistiquee. Collier en or blanc 18 carats avec un pendentif serti d\'un diamant taille brillant. Élégance et raffinement.',
      category: 'Necklaces',
      frenchCategory: 'Colliers',
      image: '../../../assets/images/Colliers/collier_1.jpg',
      images: [
        '../../../assets/images/Colliers/collier_1.jpg',
        '../../../assets/images/Colliers/collier_2.jpg',
        '../../../assets/images/Colliers/collier_3.jpg',
        '../../../assets/images/Colliers/collier_4.jpg'
      ],
      inStock: true,
      quantity: 3,
      rating: 5.0,
      reviewCount: 6,
      material: 'Or blanc 18 carats, Diamant naturel',
      dimensions: 'Chaîne : 45 cm, Pendentif : 1 cm',
      weight: '5.5g',
      features: ['Fermoir sécurisé', 'Certificat d\'authenticité'],
      style: 'Classique',
      occasion: 'Mariage, Soirée',
      warranty: '2 ans de garantie limitée',
      careInstructions: 'Nettoyer avec un chiffon doux. Éviter le contact avec des produits chimiques.',
      reviews: [
        {
          id: 1,
          userName: 'Claire M.',
          email: 'claire@example.com',
          rating: 5,
          comment: 'Un collier absolument sublime, parfait pour une soirée.',
          date: new Date('2024-12-01')
        }
      ]
    },
    {
      id: 11,
      name: 'Collier Perles de Culture',
      price: 399.99,
      description: 'Collier classique composé de perles de culture blanches, un bijou intemporel qui traverse les générations.',
      detailDescription: 'Perles de culture blanches. Idéale pour une tenue classique. Collier classique composé de perles de culture blanches, un bijou intemporel qui traverse les générations.',
      category: 'Necklaces',
      frenchCategory: 'Colliers',
      image: '../../../assets/images/Colliers/collier_2.jpg',
      images: [
        '../../../assets/images/Colliers/collier_2.jpg',
        '../../../assets/images/Colliers/collier_1.jpg',
        '../../../assets/images/Colliers/collier_3.jpg',
        '../../../assets/images/Colliers/collier_4.jpg'
      ],
      inStock: true,
      quantity: 5,
      rating: 4.8,
      reviewCount: 4,
      material: 'Perles de culture, Fermoir en or blanc',
      dimensions: 'Longueur : 40 cm',
      weight: '18g',
      features: ['Perles de culture naturelles', 'Fermoir en or blanc'],
      style: 'Élégant',
      occasion: 'Mariage, Soirée',
      warranty: '1 an de garantie',
      careInstructions: 'Nettoyer doucement avec un chiffon humide. Ranger à l\'abri de l\'humidité.',
      reviews: [
        {
          id: 2,
          userName: 'Aline D.',
          email: 'aline@example.com',
          rating: 5,
          comment: 'Des perles d\'une qualité exceptionnelle, très élégantes.',
          date: new Date('2024-11-30')
        }
      ]
    },
    {
      id: 12,
      name: 'Collier Coeur Or Rose',
      price: 249.99,
      description: 'Collier délicat en or rose avec un pendentif en forme de cœur, idéal pour un cadeau romantique.',
      detailDescription: 'Or rose 18 carats. Ideale pour un cadeau romantique. Collier délicat en or rose avec un pendentif en forme de cœur, idéal pour un cadeau romantique.',
      category: 'Necklaces',
      frenchCategory: 'Colliers',
      image: '../../../assets/images/Colliers/collier_3.jpg',
      images: [
        '../../../assets/images/Colliers/collier_3.jpg',
        '../../../assets/images/Colliers/collier_1.jpg',
        '../../../assets/images/Colliers/collier_2.jpg',
        '../../../assets/images/Colliers/collier_4.jpg'
      ],
      inStock: true,
      quantity: 10,
      rating: 4.7,
      reviewCount: 7,
      material: 'Or rose 18 carats',
      dimensions: 'Chaîne : 42 cm, Pendentif : 1.5 cm',
      weight: '4.2g',
      features: ['Design romantique', 'Fermoir à ressort'],
      style: 'Romantique',
      occasion: 'Anniversaire, Saint-Valentin',
      warranty: '1 an de garantie',
      careInstructions: 'Éviter l\'exposition prolongée à l\'eau et aux produits chimiques.',
      reviews: [
        {
          id: 3,
          userName: 'Juliette P.',
          email: 'juliette@example.com',
          rating: 4,
          comment: 'Un bijou adorable, parfait pour offrir.',
          date: new Date('2024-11-28')
        }
      ]
    },
    {
      id: 13,
      name: 'Sautoir Étoiles Argent',
      price: 179.99,
      description: 'Sautoir en argent sterling avec des pendentifs étoiles, parfait pour un look décontracté ou chic.',
      detailDescription: 'Argent sterling 925. Ideale pour un look décontracté ou chic. Sautoir en argent sterling avec des pendentifs étoiles, parfait pour un look décontracté ou chic.',
      category: 'Necklaces',
      frenchCategory: 'Colliers',
      image: '../../../assets/images/Colliers/collier_4.jpg',
      images: [
        '../../../assets/images/Colliers/collier_4.jpg',
        '../../../assets/images/Colliers/collier_1.jpg',
        '../../../assets/images/Colliers/collier_2.jpg',
        '../../../assets/images/Colliers/collier_3.jpg'
      ],
      inStock: true,
      quantity: 15,
      rating: 4.6,
      reviewCount: 5,
      material: 'Argent sterling 925',
      dimensions: 'Longueur : 60 cm',
      weight: '10g',
      features: ['Pendentifs en forme d\'étoiles', 'Finition polie'],
      style: 'Décontracté',
      occasion: 'Quotidien, Soirée',
      warranty: '1 an de garantie',
      careInstructions: 'Ranger dans une boîte à bijoux pour éviter les rayures.',
      reviews: [
        {
          id: 4,
          userName: 'Sophie L.',
          email: 'sophie@example.com',
          rating: 4,
          comment: 'Un sautoir très mignon, parfait pour un style casual.',
          date: new Date('2024-12-02')
        }
      ]
    },
    {
      id: 14,
      name: 'Collier Saphirs et Émeraudes',
      price: 1299.99,
      oldPrice: 1499.99,
      description: 'Collier luxueux en or blanc, serti de saphirs bleus et d\'émeraudes éclatants. Une pièce de collection.',
      detailDescription: 'Or blanc 18 carats, Saphirs, Émeraudes. Collier luxueux en or blanc, serti de saphirs bleus et d\'émeraudes éclatants. Une pièce de collection.',
      category: 'Necklaces',
      frenchCategory: 'Colliers',
      image: '../../../assets/images/Colliers/collier_5.jpg',
      images: [
        '../../../assets/images/Colliers/collier_5.jpg',
        '../../../assets/images/Colliers/collier_1.jpg',
        '../../../assets/images/Colliers/collier_2.jpg',
        '../../../assets/images/Colliers/collier_4.jpg'
      ],
      inStock: true,
      quantity: 2,
      rating: 5.0,
      reviewCount: 3,
      material: 'Or blanc 18 carats, Saphirs, Émeraudes',
      dimensions: 'Longueur : 45 cm',
      weight: '20g',
      features: ['Fermoir discret et sécurisé', 'Boîte cadeau luxe incluse'],
      style: 'Luxe',
      occasion: 'Mariage, Soirée spéciale',
      warranty: '2 ans de garantie limitée',
      careInstructions: 'Nettoyer avec un chiffon doux et ranger dans un écrin.',
      reviews: [
        {
          id: 5,
          userName: 'Margot V.',
          email: 'margot@example.com',
          rating: 5,
          comment: 'Un collier spectaculaire, les pierres sont magnifiques.',
          date: new Date('2024-11-30')
        }
      ]
    },
    {
      id: 15,
      name: 'Bague Solitaire Diamant',
      price: 999.99,
      oldPrice: 1199.99,
      description: 'Bague solitaire en or blanc 18 carats, sertie d\'un diamant taille brillant. Une pièce classique et intemporelle.',
      detailDescription: 'Or blanc 18 carats, Diamant naturel. Bague solitaire en or blanc 18 carats, sertie d\'un diamant taille brillant. Une pièce classique et intemporelle.',
      category: 'Rings',
      frenchCategory: 'Bagues',
      image: '../../../assets/images/Bagues/bague_1.jpg',
      images: [
        '../../../assets/images/Bagues/bague_1.jpg',
        '../../../assets/images/Bagues/bague_2.jpg',
        '../../../assets/images/Bagues/bague_3.jpg',
        '../../../assets/images/Bagues/bague_4.jpg'
      ],
      inStock: true,
      quantity: 3,
      rating: 5.0,
      reviewCount: 8,
      material: 'Or blanc 18 carats, Diamant naturel',
      dimensions: 'Taille ajustable',
      weight: '2.5g',
      features: ['Sertissage griffes', 'Certificat d\'authenticité inclus'],
      style: 'Classique',
      occasion: 'Fiançailles, Mariage',
      warranty: '2 ans de garantie limitée',
      careInstructions: 'Nettoyer avec un chiffon doux. Éviter les produits chimiques.',
      reviews: [
        {
          id: 1,
          userName: 'Amélie R.',
          email: 'amelie@example.com',
          rating: 5,
          comment: 'Une bague magnifique, parfaite pour ma demande en mariage.',
          date: new Date('2024-12-05')
        }
      ]
    },
    {
      id: 16,
      name: 'Alliance Or Jaune',
      price: 499.99,
      description: 'Alliance simple et élégante en or jaune 18 carats. Un symbole éternel d\'amour et d\'engagement.',
      detailDescription: 'Or jaune 18 carats, Alliance simple et élégante. Alliance simple et élégante en or jaune 18 carats, Un symbole éternel d\'amour et d\'engagement.',
      category: 'Rings',
      frenchCategory: 'Bagues',
      image: '../../../assets/images/Bagues/bague_2.jpg',
      images: [
        '../../../assets/images/Bagues/bague_2.jpg',
        '../../../assets/images/Bagues/bague_1.jpg',
        '../../../assets/images/Bagues/bague_3.jpg',
        '../../../assets/images/Bagues/bague_4.jpg'
      ],
      inStock: true,
      quantity: 10,
      rating: 4.8,
      reviewCount: 6,
      material: 'Or jaune 18 carats',
      dimensions: 'Largeur : 3 mm',
      weight: '3.0g',
      features: ['Finition polie', 'Gravure personnalisable'],
      style: 'Minimaliste',
      occasion: 'Mariage, Engagement',
      warranty: 'À vie',
      careInstructions: 'Polir régulièrement pour conserver l\'éclat.',
      reviews: [
        {
          id: 2,
          userName: 'Julien P.',
          email: 'julien@example.com',
          rating: 5,
          comment: 'Une alliance magnifique et sobre.',
          date: new Date('2024-12-03')
        }
      ]
    },
    {
      id: 17,
      name: 'Bague Émeraude et Diamants',
      price: 1299.99,
      oldPrice: 1499.99,
      description: 'Superbe bague en or blanc sertie d\'une émeraude centrale entourée de diamants éclatants.',
      detailDescription: 'Or blanc 18 carats, Émeraude, Diamants. Superbe bague en or blanc sertie d\'une émeraude centrale entourée de diamants éclatants.',
      category: 'Rings',
      frenchCategory: 'Bagues',
      image: '../../../assets/images/Bagues/bague_3.jpg',
      images: [
        '../../../assets/images/Bagues/bague_3.jpg',
        '../../../assets/images/Bagues/bague_1.jpg',
        '../../../assets/images/Bagues/bague_2.jpg',
        '../../../assets/images/Bagues/bague_4.jpg'
      ],
      inStock: true,
      quantity: 2,
      rating: 5.0,
      reviewCount: 4,
      material: 'Or blanc 18 carats, Émeraude, Diamants',
      dimensions: 'Taille ajustable',
      weight: '4.8g',
      features: ['Design luxueux', 'Écrin inclus'],
      style: 'Luxe',
      occasion: 'Soirée, Anniversaire',
      warranty: '2 ans de garantie',
      careInstructions: 'Nettoyer avec un produit spécifique aux pierres précieuses.',
      reviews: [
        {
          id: 3,
          userName: 'Camille L.',
          email: 'camille@example.com',
          rating: 5,
          comment: 'Une bague extraordinaire, parfaite pour une occasion spéciale.',
          date: new Date('2024-12-01')
        }
      ]
    },
    {
      id: 18,
      name: 'Chevalière Argent Gravée',
      price: 349.99,
      description: 'Chevalière élégante en argent sterling, personnalisable avec une gravure au choix.',
      detailDescription: 'Argent sterling 925, Chevalière élégante en argent sterling, personnalisable avec une gravure au choix.',
      category: 'Rings',
      frenchCategory: 'Bagues',
      image: '../../../assets/images/Bagues/bague_4.jpg',
      images: [
        '../../../assets/images/Bagues/bague_4.jpg',
        '../../../assets/images/Bagues/bague_1.jpg',
        '../../../assets/images/Bagues/bague_2.jpg',
        '../../../assets/images/Bagues/bague_3.jpg'
      ],
      inStock: true,
      quantity: 7,
      rating: 4.7,
      reviewCount: 3,
      material: 'Argent sterling 925',
      dimensions: 'Face : 1.5 cm x 1 cm',
      weight: '6.5g',
      features: ['Gravure personnalisable', 'Finition polie miroir'],
      style: 'Personnalisé',
      occasion: 'Quotidien, Cadeau',
      warranty: '1 an de garantie',
      careInstructions: 'Éviter l\'humidité pour prévenir l\'oxydation.',
      reviews: [
        {
          id: 4,
          userName: 'Lucas G.',
          email: 'lucas@example.com',
          rating: 4,
          comment: 'Une chevalière très bien finie et personnalisable.',
          date: new Date('2024-12-02')
        }
      ]
    },
    {
      id: 19,
      name: 'Bague Rubis et Diamants',
      price: 1599.99,
      oldPrice: 1799.99,
      description: 'Bague somptueuse en or rose ornée d\'un rubis central entouré de diamants éclatants.',
      detailDescription: 'Or rose 18 carats, Rubis, Diamants. Bague somptueuse en or rose ornée d\'un rubis central entouré de diamants éclatants.',
      category: 'Rings',
      frenchCategory: 'Bagues',
      image: '../../../assets/images/Bagues/bague_5.jpg',
      images: [
        '../../../assets/images/Bagues/bague_5.jpg',
        '../../../assets/images/Bagues/bague_1.jpg',
        '../../../assets/images/Bagues/bague_2.jpg',
        '../../../assets/images/Bagues/bague_3.jpg'
      ],
      inStock: true,
      quantity: 1,
      rating: 5.0,
      reviewCount: 2,
      material: 'Or rose 18 carats, Rubis, Diamants',
      dimensions: 'Taille ajustable',
      weight: '5.2g',
      features: ['Rubis naturel', 'Écrin luxe inclus'],
      style: 'Luxueux',
      occasion: 'Soirée, Anniversaire',
      warranty: '2 ans de garantie',
      careInstructions: 'Nettoyer avec un chiffon doux et éviter les chocs.',
      reviews: [
        {
          id: 5,
          userName: 'Élise T.',
          email: 'elise@example.com',
          rating: 5,
          comment: 'Une bague éblouissante, les pierres sont de très haute qualité.',
          date: new Date('2024-12-04')
        }
      ]
    }
  ];
}
