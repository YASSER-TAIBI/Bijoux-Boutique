import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    this.registerForm = this.fb.group({
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)]],
      address: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log('Tentative de connexion avec:', this.loginForm.value);
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Réponse de connexion:', response);
          if (response && response.token) {
            // Vérifier s'il y a une redirection en attente
            const redirectUrl = localStorage.getItem('redirectAfterLogin');
            if (redirectUrl) {
              localStorage.removeItem('redirectAfterLogin');
              // Attendre 2secondes pour que le profil soit chargé
              setTimeout(() => {
                this.router.navigate([redirectUrl]);
              }, 2000);
            } else {
              this.router.navigate(['/']);
            }
          }
        },
        error: (error) => {
          console.error('Erreur de connexion:', error);        }
      });
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const userData = {
        name: `${this.registerForm.value.firstName} ${this.registerForm.value.lastName}`,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        phone: this.registerForm.value.phone,
        address: {
          street: this.registerForm.value.address,
          city: this.registerForm.value.city,
          zip: this.registerForm.value.postalCode,
          country: this.registerForm.value.country
        },
        role: "user"
      };
      
      console.log('Tentative d\'inscription avec:', userData);
      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Réponse d\'inscription:', response);
          if (response && response.token) {
            // Charger le profil après l'inscription
            this.authService.getUserProfile().subscribe({
              next: (user) => {
                console.log('Profil chargé avec succès:', user);
                // Vérifier s'il y a une redirection en attente
                const redirectUrl = localStorage.getItem('redirectAfterLogin');
                if (redirectUrl) {
                  localStorage.removeItem('redirectAfterLogin');
                  this.router.navigate([redirectUrl]);
                } else {
                  window.location.reload(); // Pour forcer la mise à jour du header
                }
              },
              error: (error) => {
                console.error('Erreur lors du chargement du profil:', error);
              }
            });
          }
        },
        error: (error) => {
          console.error('Erreur d\'inscription:', error);
        }
      });
    }
  }

  forgotPassword() {
    console.log('Forgot password clicked');
    // TODO: Implémenter la logique de récupération de mot de passe
  }

  viewCart(): void {
    this.router.navigate(['/cart']);
  }
}
