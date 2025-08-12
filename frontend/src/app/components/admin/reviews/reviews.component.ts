import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../../services/review.service';
import { ProductService } from '../../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Review } from '../../../models/review.interface';
import { fadeSlideInAnimation } from '../../../animations/shared.animations';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  animations: [fadeSlideInAnimation]
})
export class ReviewsComponent implements OnInit {
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  products: any[] = [];
  
  // Filtres et recherche
  searchTerm: string = '';
  selectedRating: string = '';
  selectedVisibility: string = '';
  selectedProduct: string = '';
  sortBy: string = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  
  // États
  loading: boolean = false;
  error: string | null = null;
  selectedReviews: Set<string> = new Set();
  
  // Modals
  showViewModal: boolean = false;
  selectedReview: Review | null = null;
  
  // Statistiques
  stats = {
    total: 0,
    visible: 0,
    hidden: 0,
    averageRating: 0,
    byRating: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  };

  constructor(
    private reviewService: ReviewService,
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadReviews();
    this.loadProducts();
  }

  // Charger tous les avis
  loadReviews() {
    this.loading = true;
    this.error = null;
    
    // Utiliser l'endpoint admin pour récupérer tous les avis
    this.reviewService.getAllReviews().subscribe({
      next: (response) => {
        if (response.success) {
          this.reviews = response.reviews || [];
          this.calculateStats();
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des avis:', error);
        this.error = 'Erreur lors du chargement des avis';
        this.toastr.error('Erreur lors du chargement des avis');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // Charger la liste des produits pour les filtres
  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
      }
    });
  }

  // Calculer les statistiques
  calculateStats() {
    this.stats.total = this.reviews.length;
    this.stats.visible = this.reviews.filter(r => r.isVisible).length;
    this.stats.hidden = this.reviews.filter(r => !r.isVisible).length;
    
    if (this.reviews.length > 0) {
      const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
      this.stats.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
    }
    
    // Statistiques par note
    this.stats.byRating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    this.reviews.forEach(review => {
      this.stats.byRating[review.rating as keyof typeof this.stats.byRating]++;
    });
  }

  // Appliquer les filtres
  applyFilters() {
    let filtered = [...this.reviews];

    // Filtre par recherche (nom utilisateur, email, commentaire)
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(review => 
        review.userName.toLowerCase().includes(term) ||
        review.email.toLowerCase().includes(term) ||
        review.comment.toLowerCase().includes(term)
      );
    }

    // Filtre par note
    if (this.selectedRating) {
      filtered = filtered.filter(review => review.rating === parseInt(this.selectedRating));
    }

    // Filtre par visibilité
    if (this.selectedVisibility) {
      const isVisible = this.selectedVisibility === 'visible';
      filtered = filtered.filter(review => review.isVisible === isVisible);
    }

    // Filtre par produit
    if (this.selectedProduct) {
      filtered = filtered.filter(review => review.productId === this.selectedProduct);
    }

    // Tri
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'userName':
          comparison = a.userName.localeCompare(b.userName);
          break;
        default:
          comparison = 0;
      }
      
      return this.sortDirection === 'desc' ? -comparison : comparison;
    });

    this.filteredReviews = filtered;
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  // Obtenir les avis de la page actuelle
  getPaginatedReviews(): Review[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredReviews.slice(start, end);
  }

  // Changer de page
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Changer le tri
  changeSort(field: string) {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'desc';
    }
    this.applyFilters();
  }

  // Basculer la visibilité d'un avis
  toggleVisibility(review: Review) {
    const newVisibility = !review.isVisible;
    
    this.reviewService.updateReviewVisibility(review._id!, newVisibility).subscribe({
      next: (response) => {
        if (response.success) {
          review.isVisible = newVisibility;
          this.calculateStats();
          this.toastr.success(`Avis ${newVisibility ? 'rendu visible' : 'masqué'}`);
        }
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour de la visibilité:', error);
        this.toastr.error('Erreur lors de la mise à jour de la visibilité');
      }
    });
  }

  // Supprimer un avis
  deleteReview(review: Review) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      this.reviewService.deleteReview(review._id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.reviews = this.reviews.filter(r => r._id !== review._id);
            this.applyFilters();
            this.calculateStats();
            this.toastr.success('Avis supprimé avec succès');
          }
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.toastr.error('Erreur lors de la suppression de l\'avis');
        }
      });
    }
  }

  // Gestion de la sélection multiple
  toggleSelection(reviewId: string) {
    if (this.selectedReviews.has(reviewId)) {
      this.selectedReviews.delete(reviewId);
    } else {
      this.selectedReviews.add(reviewId);
    }
  }

  // Sélectionner/désélectionner tous
  toggleSelectAll() {
    const currentPageReviews = this.getPaginatedReviews();
    const allSelected = currentPageReviews.every(r => this.selectedReviews.has(r._id!));
    
    if (allSelected) {
      currentPageReviews.forEach(r => this.selectedReviews.delete(r._id!));
    } else {
      currentPageReviews.forEach(r => this.selectedReviews.add(r._id!));
    }
  }

  // Actions en lot
  bulkAction(action: 'show' | 'hide' | 'delete') {
    if (this.selectedReviews.size === 0) {
      this.toastr.warning('Veuillez sélectionner au moins un avis');
      return;
    }

    const selectedCount = this.selectedReviews.size;
    const selectedIds = Array.from(this.selectedReviews);

    if (action === 'delete') {
      if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedCount} avis ?`)) {
        return;
      }
    }

    // Traiter chaque avis sélectionné
    let completedActions = 0;
    const totalActions = selectedIds.length;

    selectedIds.forEach(reviewId => {
      const review = this.reviews.find(r => r._id === reviewId);
      if (!review) return;

      let actionObservable;

      switch (action) {
        case 'show':
          actionObservable = this.reviewService.updateReviewVisibility(reviewId, true);
          break;
        case 'hide':
          actionObservable = this.reviewService.updateReviewVisibility(reviewId, false);
          break;
        case 'delete':
          actionObservable = this.reviewService.deleteReview(reviewId);
          break;
      }

      actionObservable.subscribe({
        next: (response) => {
          if (response.success) {
            switch (action) {
              case 'show':
                review.isVisible = true;
                break;
              case 'hide':
                review.isVisible = false;
                break;
              case 'delete':
                this.reviews = this.reviews.filter(r => r._id !== reviewId);
                break;
            }
          }
          
          completedActions++;
          if (completedActions === totalActions) {
            this.selectedReviews.clear();
            this.applyFilters();
            this.calculateStats();
            
            const actionText = action === 'show' ? 'rendu(s) visible(s)' : 
                              action === 'hide' ? 'masqué(s)' : 'supprimé(s)';
            this.toastr.success(`${selectedCount} avis ${actionText}`);
          }
        },
        error: (error) => {
          console.error(`Erreur lors de l'action ${action}:`, error);
          completedActions++;
          if (completedActions === totalActions) {
            this.selectedReviews.clear();
            this.toastr.error('Certaines actions ont échoué');
          }
        }
      });
    });
  }

  // Obtenir le nom du produit
  getProductName(productId: string | undefined): string {
    if (!productId) return 'Produit non spécifié';
    const product = this.products.find(p => p._id === productId);
    return product ? product.name : 'Produit supprimé';
  }

  // Formater la date
  formatDate(date: Date | string): string {
    return this.reviewService.formatDate(date);
  }

  // Réinitialiser les filtres
  resetFilters() {
    this.searchTerm = '';
    this.selectedRating = '';
    this.selectedVisibility = '';
    this.selectedProduct = '';
    this.sortBy = 'date';
    this.sortDirection = 'desc';
    this.applyFilters();
  }

  // Méthode trackBy pour optimiser les performances
  trackByReviewId(index: number, review: Review): string {
    return review._id || index.toString();
  }

  // TrackBy pour la pagination
  trackByPageNumber(index: number, page: number): number {
    return page;
  }

  // Méthodes utilitaires pour le template
  isAllSelected(): boolean {
    const currentPageReviews = this.getPaginatedReviews();
    return currentPageReviews.length > 0 && currentPageReviews.every(r => this.selectedReviews.has(r._id!));
  }

  // Exposer Math pour le template
  Math = Math;

  // Générer un tableau pour la pagination
  getPaginationArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Modal de visualisation
  viewReview(review: Review) {
    this.selectedReview = review;
    this.showViewModal = true;
  }

  // Fermer les modals
  closeModals() {
    this.showViewModal = false;
    this.selectedReview = null;
  }
}
