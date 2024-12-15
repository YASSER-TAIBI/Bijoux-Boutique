import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>À propos</h3>
            <p>Bijoux Boutique - Votre destination pour des bijoux uniques et raffinés.</p>
          </div>
          <div class="footer-section">
            <h3>Contact</h3>
            <p>Email: contact&#64;bijoux-boutique.com</p>
            <p>Tél: +33 1 23 45 67 89</p>
          </div>
          <div class="footer-section">
            <h3>Liens utiles</h3>
            <ul>
              <li><a routerLink="/about">À propos</a></li>
              <li><a routerLink="/contact">Contact</a></li>
              <li><a routerLink="/cgv">CGV</a></li>
              <li><a routerLink="/mentions-legales">Mentions légales</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} Bijoux Boutique. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--primary-color);
      color: white;
      padding: 60px 0 20px;
      margin-top: 60px;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
      margin-bottom: 40px;
    }

    .footer-section {
      h3 {
        color: var(--secondary-color);
        margin-bottom: 20px;
        font-size: 1.2rem;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          margin-bottom: 10px;
        }

        a {
          color: white;
          text-decoration: none;
          transition: color 0.3s ease;

          &:hover {
            color: var(--secondary-color);
          }
        }
      }
    }

    .footer-bottom {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
