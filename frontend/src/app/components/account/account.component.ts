import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { fadeSlideInAnimation } from '../../animations/shared.animations';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  animations: [fadeSlideInAnimation]
})
export class AccountComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private wishlistService: WishlistService,
    private toastr: ToastrService
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

  ngOnInit(): void {
  }

  private handlePostLoginActions() {
    // Vérifier s'il y a un produit à ajouter aux favoris
    const productToAdd = localStorage.getItem('addToWishlistAfterLogin');
    if (productToAdd) {
      this.wishlistService.addToWishlist(productToAdd).subscribe({
        next: () => {
          this.toastr.success('Le produit a été ajouté à vos favoris');
          localStorage.removeItem('addToWishlistAfterLogin');
          this.wishlistService.loadWishlist();
        },
        error: (error) => {
          this.toastr.error('Erreur lors de l\'ajout aux favoris');
          console.error('Erreur lors de l\'ajout aux favoris après connexion:', error);
        }
      });
    }

    // Vérifier s'il y a une redirection en attente
    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
      localStorage.removeItem('redirectAfterLogin');
      this.router.navigate([redirectUrl]);
    } else {
      this.router.navigate(['/']);
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response && response.token) {
            this.toastr.success('Connexion réussie !');
            this.handlePostLoginActions();
          }
        },
        error: (error) => {
          if (error.status === 401) {
            this.toastr.error('Email ou mot de passe incorrect');
          } else {
            this.toastr.error('Une erreur est survenue lors de la connexion');
          }
          console.error('Erreur de connexion:', error);
        }
      });
    } else {
      if (this.loginForm.get('email')?.hasError('required')) {
        this.toastr.warning('L\'email est requis');
      } else if (this.loginForm.get('email')?.hasError('email')) {
        this.toastr.warning('Format d\'email invalide');
      }
      if (this.loginForm.get('password')?.hasError('required')) {
        this.toastr.warning('Le mot de passe est requis');
      }
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
      
      this.authService.register(userData).subscribe({
        next: (response) => {
          if (response && response.token) {
            this.toastr.success('Inscription réussie ! Bienvenue !');
            this.handlePostLoginActions();
          }
        },
        error: (error) => {
          if (error.status === 409) {
            this.toastr.error('Cette adresse email est déjà utilisée');
          } else {
            this.toastr.error('Une erreur est survenue lors de l\'inscription');
          }
          console.error('Erreur d\'inscription:', error);
        }
      });
    } else {
      this.validateRegisterForm();
    }
  }

  private validateRegisterForm() {
    const form = this.registerForm;
    if (form.get('firstName')?.hasError('required')) {
      this.toastr.warning('Le prénom est requis');
    } else if (form.get('firstName')?.hasError('minlength')) {
      this.toastr.warning('Le prénom doit contenir au moins 2 caractères');
    }

    if (form.get('lastName')?.hasError('required')) {
      this.toastr.warning('Le nom est requis');
    } else if (form.get('lastName')?.hasError('minlength')) {
      this.toastr.warning('Le nom doit contenir au moins 2 caractères');
    }

    if (form.get('email')?.hasError('required')) {
      this.toastr.warning('L\'email est requis');
    } else if (form.get('email')?.hasError('email')) {
      this.toastr.warning('Format d\'email invalide');
    }

    if (form.get('password')?.hasError('required')) {
      this.toastr.warning('Le mot de passe est requis');
    } else if (form.get('password')?.hasError('minlength')) {
      this.toastr.warning('Le mot de passe doit contenir au moins 6 caractères');
    }

    if (form.get('phone')?.hasError('required')) {
      this.toastr.warning('Le numéro de téléphone est requis');
    } else if (form.get('phone')?.hasError('pattern')) {
      this.toastr.warning('Format de numéro de téléphone invalide');
    }

    if (form.get('address')?.hasError('required')) {
      this.toastr.warning('L\'adresse est requise');
    }

    if (form.get('postalCode')?.hasError('required')) {
      this.toastr.warning('Le code postal est requis');
    } else if (form.get('postalCode')?.hasError('pattern')) {
      this.toastr.warning('Le code postal doit contenir 5 chiffres');
    }

    if (form.get('city')?.hasError('required')) {
      this.toastr.warning('La ville est requise');
    }

    if (form.get('country')?.hasError('required')) {
      this.toastr.warning('Le pays est requis');
    }
  }

  forgotPassword() {
    this.toastr.info('La récupération de mot de passe sera bientôt disponible');
  }

  viewCart(): void {
    this.router.navigate(['/cart']);
  }
}
