import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ProductAdminService } from '../../../services/product-admin.service';
import { FirebaseStorageService } from '../../../services/firebase-storage.service';
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
    private firebaseStorage: FirebaseStorageService,
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
      category: ['', Validators.required],
      frenchCategory: ['', Validators.required],
      image: ['', Validators.required],
      images: [[]],
      material: ['', Validators.required],
      dimensions: [''],
      weight: [''],
      features: [[]],
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
  
  openEditModal(product: Product): void {
    this.selectedProduct = product;
    this.productForm.patchValue({
      ...product,
      images: product.images || [],
      features: product.features || []
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
      const validation = this.firebaseStorage.validateImageFile(file);
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
      const uploadedUrls = await this.firebaseStorage.uploadMultipleImages(this.selectedImages);
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
      // Optionnel : supprimer de Firebase Storage
      const imageUrl = this.imageUrls[index];
      this.firebaseStorage.deleteImage(imageUrl).catch(error => {
        console.warn('Could not delete image from Firebase:', error);
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
    if (this.productForm.valid) {
      try {
        // Upload des images d'abord
        const uploadedImageUrls = await this.uploadImages();
        
        const productData = {
          ...this.productForm.value,
          images: uploadedImageUrls
        };
      
      this.productService.createProduct(productData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadProducts();
            this.closeModals();
          },
          error: (error: any) => {
            this.error = 'Erreur lors de la création du produit';
            console.error('Erreur:', error);
          }
        });
      } catch (error) {
        this.error = 'Erreur lors de l\'upload des images';
        console.error('Upload error:', error);
      }
    }
  }
  
  async updateProduct(): Promise<void> {
    if (this.productForm.valid && this.selectedProduct?._id) {
      try {
        // Upload des nouvelles images si nécessaire
        const uploadedImageUrls = await this.uploadImages();
        
        const productData = {
          ...this.productForm.value,
          images: uploadedImageUrls
        };
      
      this.productService.updateProduct(this.selectedProduct._id, productData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadProducts();
            this.closeModals();
          },
          error: (error: any) => {
            this.error = 'Erreur lors de la mise à jour du produit';
            console.error('Erreur:', error);
          }
        });
      } catch (error) {
        this.error = 'Erreur lors de l\'upload des images';
        console.error('Upload error:', error);
      }
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
}
