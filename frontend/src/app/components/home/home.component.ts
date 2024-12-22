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
  currentTestimonialIndex = 0;

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

  testimonials = [
    {
      text: "Une expérience d'achat exceptionnelle ! Les bijoux sont d'une qualité remarquable et le service client est impeccable. Je recommande vivement cette boutique pour des pièces uniques et élégantes.",
      author: "Marie Laurent",
      rating: 5
    },
    {
      text: "J'ai trouvé la bague de fiançailles parfaite ici. Le conseil personnalisé était excellent et le résultat dépasse mes attentes. Ma fiancée est ravie !",
      author: "Thomas Dubois",
      rating: 5
    },
    {
      text: "Des créations magnifiques qui allient tradition et modernité. La qualité est au rendez-vous et les prix sont justifiés pour des pièces aussi bien travaillées.",
      author: "Sophie Martin",
      rating: 5
    },
    {
      text: "Un service exceptionnel et des bijoux qui racontent une histoire. Chaque pièce est unique et l'attention aux détails est remarquable.",
      author: "Claire Moreau",
      rating: 5
    },
    {
      text: "Je suis cliente régulière et je ne suis jamais déçue. Les collections sont toujours renouvelées avec goût et la qualité reste constante.",
      author: "Julie Petit",
      rating: 5
    }
  ];

  nextTestimonial() {
    const testimonialCards = document.querySelector('.testimonial-cards') as HTMLElement;
    this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
    testimonialCards.style.transform = `translateX(-${this.currentTestimonialIndex * 33.333}%)`;
  }

  previousTestimonial() {
    const testimonialCards = document.querySelector('.testimonial-cards') as HTMLElement;
    this.currentTestimonialIndex = this.currentTestimonialIndex === 0 
      ? this.testimonials.length - 1 
      : this.currentTestimonialIndex - 1;
    testimonialCards.style.transform = `translateX(-${this.currentTestimonialIndex * 33.333}%)`;
  }
}
