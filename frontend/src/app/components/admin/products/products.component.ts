import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ProductAdminService } from '../../../services/product-admin.service';
import { CloudinaryStorageService } from '../../../services/cloudinary-storage.service';
import { fadeSlideInAnimation } from '../../../animations/shared.animations';
import { Product } from '../../../models/product.interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [fadeSlideInAnimation]
})
export class ProductsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  error: string | null = null;
  
  // Filtres et recherche
  searchTerm = '';
  selectedCategory = '';
  categories = ['Bagues', 'Colliers', 'Bracelets', 'Boucles d\'oreilles', 'Autres'];
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;
  
  // Modals
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  showViewModal = false;
  selectedProduct: Product | null = null;
  
  // Formulaires
  productForm: FormGroup;
  
  // Gestion des images
  selectedImages: File[] = [];
  imageUrls: string[] = [];
  imagePreviewUrls: string[] = [];
  uploadingImages = false;
  imageUploadError: string | null = null;
  
  constructor(
    private productService: ProductAdminService,
    private cloudinaryService: CloudinaryStorageService,
    private fb: FormBuilder
  ) {
    this.productForm = this.createProductForm();
  }
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private createProductForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      detailDescription: ['', [Validators.required, Validators.minLength(20)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      oldPrice: [null],
      discountPrice: [null],
      category: [''], // Optionnel, sera généré depuis frenchCategory
      frenchCategory: ['', Validators.required],
      image: ['', Validators.required],
      images: [[]],
      material: ['', Validators.required],
      dimensions: [''],
      weight: [''],
      features: [[]],
      featuresText: [''], // Champ texte pour saisir les caractéristiques
      style: [''],
      occasion: [''],
      warranty: [''],
      careInstructions: [''],
      quantity: [0, [Validators.required, Validators.min(0)]],
      rating: [0],
      reviewCount: [0]
    });
  }
  
  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products: Product[]) => {
          this.products = products;
          this.applyFilters();
          this.loading = false;
        },
        error: (error: any) => {
          this.error = 'Erreur lors du chargement des produits';
          console.error('Erreur:', error);
          this.loading = false;
        }
      });
  }
  
  applyFilters(): void {
    let filtered = [...this.products];
    
    // Filtre par recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        (product.material && product.material.toLowerCase().includes(term)) ||
        product.frenchCategory.toLowerCase().includes(term)
      );
    }
    
    // Filtre par catégorie française
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.frenchCategory === this.selectedCategory);
    }
    
    this.filteredProducts = filtered;
    this.updatePagination();
  }
  
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }
  
  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProducts.slice(start, end);
  }
  
  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }
  
  onCategoryChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }
  
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.currentPage = 1;
    this.applyFilters();
  }
  
  // Gestion des pages
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  // Gestion des modals
  openCreateModal(): void {
    this.productForm.reset();
    this.productForm.patchValue({
      price: 0,
      oldPrice: null,
      discountPrice: null,
      images: [],
      features: [],
      quantity: 0,
      rating: 0,
      reviewCount: 0
    });
    this.showCreateModal = true;
  }

  openViewModal(product: Product): void {
    this.selectedProduct = product;
    this.showViewModal = true;
    console.log('👁️ Ouverture modal visualisation pour:', product.name);
    console.log('📋 Données complètes du produit:', product);
  }
  
  openEditModal(product: Product): void {
    this.selectedProduct = product;
    
    // Convertir le tableau features en string pour l'affichage
    const featuresText = product.features ? product.features.join(', ') : '';
    
    this.productForm.patchValue({
      ...product,
      images: product.images || [],
      features: product.features || [],
      featuresText: featuresText
    });
    
    // Charger les images existantes
    this.imageUrls = product.images || [];
    this.selectedImages = [];
    this.imagePreviewUrls = [];
    this.imageUploadError = null;
    
    this.showEditModal = true;
  }
  
  openDeleteModal(product: Product): void {
    this.selectedProduct = product;
    this.showDeleteModal = true;
  }
  
  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.showViewModal = false;
    this.selectedProduct = null;
    this.resetImageUpload();
  }
  
  // Gestion des images
  onImagesSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.selectedImages = [];
    this.imagePreviewUrls = [];
    this.imageUploadError = null;

    // Valider chaque fichier
    for (const file of files) {
      const validation = this.cloudinaryService.validateImageFile(file);
      if (!validation.isValid) {
        this.imageUploadError = validation.error || 'Fichier invalide';
        return;
      }
      this.selectedImages.push(file);
      this.imagePreviewUrls.push(URL.createObjectURL(file));
    }

    // Limiter à 5 images maximum
    if (this.selectedImages.length > 5) {
      this.imageUploadError = 'Maximum 5 images autorisées';
      this.selectedImages = this.selectedImages.slice(0, 5);
      this.imagePreviewUrls = this.imagePreviewUrls.slice(0, 5);
    }
  }

  async uploadImages(): Promise<string[]> {
    if (this.selectedImages.length === 0) {
      return this.imageUrls;
    }

    this.uploadingImages = true;
    this.imageUploadError = null;

    try {
      const uploadedUrls = await this.cloudinaryService.uploadMultipleImages(this.selectedImages);
      this.imageUrls = [...this.imageUrls, ...uploadedUrls];
      return this.imageUrls;
    } catch (error) {
      this.imageUploadError = 'Erreur lors de l\'upload des images';
      console.error('Upload error:', error);
      throw error;
    } finally {
      this.uploadingImages = false;
    }
  }

  removeImage(index: number): void {
    if (index >= 0 && index < this.imageUrls.length) {
      // Optionnel : supprimer de Cloudinary Storage
      const imageUrl = this.imageUrls[index];
      this.cloudinaryService.deleteImage(imageUrl).catch(error => {
        console.warn('Could not delete image from Cloudinary:', error);
      });
      
      this.imageUrls.splice(index, 1);
    }
  }

  removeSelectedImage(index: number): void {
    if (index >= 0 && index < this.selectedImages.length) {
      this.selectedImages.splice(index, 1);
      this.imagePreviewUrls.splice(index, 1);
    }
  }

  resetImageUpload(): void {
    this.selectedImages = [];
    this.imageUrls = [];
    this.imagePreviewUrls = [];
    this.uploadingImages = false;
    this.imageUploadError = null;
  }

  // Actions CRUD
  async createProduct(): Promise<void> {
    console.log('🔍 Début création produit');
    console.log('📝 Formulaire valide:', this.productForm.valid);
    console.log('📋 Erreurs formulaire:', this.getFormErrors());
    
    if (this.productForm.valid) {
      this.loading = true;
      try {
        console.log('📤 Upload des images...');
        // Upload des images d'abord
        const uploadedImageUrls = await this.uploadImages();
        console.log('✅ Images uploadées:', uploadedImageUrls);
        
        // Convertir featuresText en tableau features
        const formValue = this.productForm.value;
        console.log('📄 Valeurs formulaire:', formValue);
        
        const features = formValue.featuresText 
          ? formValue.featuresText.split(',').map((f: string) => f.trim()).filter((f: string) => f.length > 0)
          : [];
        
        // Générer category depuis frenchCategory
        const categoryMapping: { [key: string]: string } = {
          'Bagues': 'Rings',
          'Colliers': 'Necklaces',
          'Bracelets': 'Bracelets',
          'Boucles d\'oreilles': 'Earrings',
          'Autres': 'Others'
        };
        
        const productData = {
          ...formValue,
          category: categoryMapping[formValue.frenchCategory] || 'Others',
          frenchCategory: formValue.frenchCategory,
          images: uploadedImageUrls,
          features: features,
          // S'assurer que les champs numériques sont corrects
          price: Number(formValue.price),
          oldPrice: formValue.oldPrice ? Number(formValue.oldPrice) : null,
          discountPrice: formValue.discountPrice ? Number(formValue.discountPrice) : null,
          quantity: Number(formValue.quantity),
          rating: Number(formValue.rating || 0),
          reviewCount: Number(formValue.reviewCount || 0)
        };
        
        // Supprimer featuresText du payload (pas nécessaire en base)
        delete productData.featuresText;
        
        console.log('🚀 Données à envoyer:', productData);
        
        this.productService.createProduct(productData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              console.log('✅ Produit créé avec succès:', response);
              this.loading = false;
              this.loadProducts();
              this.closeModals();
            },
            error: (error: any) => {
              console.error('❌ Erreur création produit:', error);
              console.error('📋 Status:', error.status);
              console.error('📋 StatusText:', error.statusText);
              console.error('📋 Error body:', error.error);
              console.error('📋 URL:', error.url);
              
              let errorMessage = 'Erreur lors de la création du produit';
              if (error.error && error.error.message) {
                errorMessage += `: ${error.error.message}`;
              } else if (error.message) {
                errorMessage += `: ${error.message}`;
              }
              
              this.error = errorMessage;
              this.loading = false;
            }
          });
      } catch (error) {
        console.error('❌ Erreur upload images:', error);
        this.error = `Erreur lors de l'upload des images: ${error}`;
        this.loading = false;
      }
    } else {
      console.log('❌ Formulaire invalide');
      this.error = 'Veuillez remplir tous les champs obligatoires';
      this.markFormGroupTouched();
    }
  }
  
  async updateProduct(): Promise<void> {
    console.log('🔍 Début modification produit');
    console.log('📝 Formulaire valide:', this.productForm.valid);
    
    if (this.productForm.valid && this.selectedProduct?._id) {
      this.loading = true;
      try {
        console.log('📤 Upload des nouvelles images...');
        // Upload des nouvelles images si nécessaire
        const uploadedImageUrls = await this.uploadImages();
        console.log('✅ Images uploadées:', uploadedImageUrls);
        
        // Convertir featuresText en tableau features
        const formValue = this.productForm.value;
        console.log('📄 Valeurs formulaire:', formValue);
        
        const features = formValue.featuresText 
          ? formValue.featuresText.split(',').map((f: string) => f.trim()).filter((f: string) => f.length > 0)
          : [];
        
        // Générer category depuis frenchCategory
        const categoryMapping: { [key: string]: string } = {
          'Bagues': 'Rings',
          'Colliers': 'Necklaces',
          'Bracelets': 'Bracelets',
          'Boucles d\'oreilles': 'Earrings',
          'Autres': 'Others'
        };
        
        const productData = {
          ...formValue,
          category: categoryMapping[formValue.frenchCategory] || 'Others',
          frenchCategory: formValue.frenchCategory,
          images: uploadedImageUrls,
          features: features,
          // S'assurer que les champs numériques sont corrects
          price: Number(formValue.price),
          oldPrice: formValue.oldPrice ? Number(formValue.oldPrice) : null,
          discountPrice: formValue.discountPrice ? Number(formValue.discountPrice) : null,
          quantity: Number(formValue.quantity),
          rating: Number(formValue.rating || 0),
          reviewCount: Number(formValue.reviewCount || 0)
        };
        
        // Supprimer featuresText du payload (pas nécessaire en base)
        delete productData.featuresText;
        
        console.log('🚀 Données à envoyer:', productData);
        
        // 🔧 CORRECTION BACKEND: Adapter les champs pour le modèle backend
        productData.stock = productData.quantity; // Backend attend 'stock' au lieu de 'quantity'
        //delete productData.quantity; // Supprimer quantity car on utilise stock
        
        // Le backend génère automatiquement 'image' depuis 'images[0]'
        // Tous les autres champs sont maintenant supportés par le backend
        
        console.log('🚀 Données adaptées pour le backend:', productData);
      
        this.productService.updateProduct(this.selectedProduct._id, productData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              console.log('✅ Produit modifié avec succès:', response);
              this.loading = false;
              this.loadProducts();
              this.closeModals();
            },
            error: (error: any) => {
              console.error('❌ Erreur modification produit:', error);
              this.error = `Erreur lors de la mise à jour du produit: ${error.message || error}`;
              this.loading = false;
            }
          });
      } catch (error) {
        console.error('❌ Erreur upload images:', error);
        this.error = `Erreur lors de l'upload des images: ${error}`;
        this.loading = false;
      }
    } else {
      console.log('❌ Formulaire invalide ou produit non sélectionné');
      this.error = 'Veuillez remplir tous les champs obligatoires';
      this.markFormGroupTouched();
    }
  }
  
  deleteProduct(): void {
    if (this.selectedProduct?._id) {
      this.productService.deleteProduct(this.selectedProduct._id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadProducts();
            this.closeModals();
          },
          error: (error: any) => {
            this.error = 'Erreur lors de la suppression du produit';
            console.error('Erreur:', error);
          }
        });
    }
  }
  
  // Utilitaires
  getProductImage(product: Product): string {
    if (product.image) {
      return product.image.startsWith('http') ? product.image : `assets/images/products/${product.image}`;
    }
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      return firstImage.startsWith('http') ? firstImage : `assets/images/products/${firstImage}`;
    }
    return 'assets/images/placeholder.jpg';
  }
  
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }
  
  hasDiscount(product: Product): boolean {
    return !!(product.oldPrice && product.oldPrice > product.price);
  }
  
  getDiscountPercentage(product: Product): number {
    if (!product.oldPrice || product.oldPrice <= product.price) return 0;
    return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  }
  
  isOutOfStock(product: Product): boolean {
    return (product.quantity || 0) === 0;
  }
  
  getStockClass(stock: number): string {
    if (stock === 0) return 'stock-empty';
    if (stock <= 5) return 'stock-low';
    if (stock <= 20) return 'stock-medium';
    return 'stock-high';
  }

  getStatusClass(product: Product): string {
    const stock = product.quantity || 0;
    if (stock === 0) return 'status-out-of-stock';
    if (stock <= 5) return 'status-low-stock';
    return 'status-available';
  }

  getStatusText(product: Product): string {
    const stock = product.quantity || 0;
    if (stock === 0) return 'Rupture';
    if (stock <= 5) return 'Stock faible';
    return 'Disponible';
  }

  getImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  // Méthodes utilitaires pour diagnostiquer les erreurs
  getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}
