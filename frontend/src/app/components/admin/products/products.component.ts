import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ProductAdminService } from '../../../services/product-admin.service';
import { CloudinaryStorageService } from '../../../services/cloudinary-storage.service';
import { fadeSlideInAnimation } from '../../../animations/shared.animations';
import { Product } from '../../../models/product.interface';

interface ProductPhoto {
  file?: File;
  url?: string;
  preview?: string;
  name?: string;
  type: 'cover' | 'face' | 'side-right' | 'side-left' | 'detail';
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss', './photo-slots.scss'],
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
  
  // Gestion des images avec slots
  productPhotos: (ProductPhoto | null)[] = [null, null, null, null, null];
  uploadingImages = false;
  imageUploadError: string | null = null;
  
  // Drag & Drop
  isDragOver = false;
  dragTargetIndex: number | null = null;
  dragSourceIndex: number | null = null;
  currentSlotTarget: number | null = null;
  
  // Validation photos
  readonly MIN_PHOTOS = 4;
  readonly MAX_PHOTOS = 5;
  
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
    
    // Charger les images existantes dans les slots
    this.loadProductPhotosFromUrls(product.images || []);
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
    this.resetPhotoSlots();
  }
  
  // === GESTION DES PHOTOS AVEC SLOTS ===
  
  // Méthodes de gestion des slots
  getFilledSlotsCount(): number {
    return this.productPhotos.filter(photo => photo !== null).length;
  }
  
  getPhotoTypeByIndex(index: number): string {
    const types = ['cover', 'face', 'side-right', 'side-left', 'detail'];
    return types[index] || 'unknown';
  }
  
  // Sélection de photos pour un slot spécifique
  selectPhotoForSlot(slotIndex: number): void {
    this.currentSlotTarget = slotIndex;
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg,image/jpg,image/png,image/webp';
    fileInput.multiple = false;
    
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.addPhotoToSlot(file, slotIndex);
      }
    };
    
    fileInput.click();
  }
  
  // Gestion des fichiers sélectionnés (zone d'ajout)
  onImagesSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.imageUploadError = null;
    
    for (const file of files) {
      const validation = this.cloudinaryService.validateImageFile(file);
      if (!validation.isValid) {
        this.imageUploadError = validation.error || 'Fichier invalide';
        continue;
      }
      
      // Trouver le premier slot vide
      const emptySlotIndex = this.productPhotos.findIndex(photo => photo === null);
      if (emptySlotIndex !== -1) {
        this.addPhotoToSlot(file, emptySlotIndex);
      } else {
        this.imageUploadError = 'Tous les slots sont remplis (maximum 5 photos)';
        break;
      }
    }
  }
  
  // Ajouter une photo à un slot spécifique
  addPhotoToSlot(file: File, slotIndex: number): void {
    if (slotIndex < 0 || slotIndex >= this.MAX_PHOTOS) return;
    
    const validation = this.cloudinaryService.validateImageFile(file);
    if (!validation.isValid) {
      this.imageUploadError = validation.error || 'Fichier invalide';
      return;
    }
    
    const preview = URL.createObjectURL(file);
    const photoType = this.getPhotoTypeByIndex(slotIndex) as any;
    
    this.productPhotos[slotIndex] = {
      file,
      preview,
      name: file.name,
      type: photoType
    };
    
    this.imageUploadError = null;
  }
  
  // Supprimer une photo d'un slot
  removePhoto(event: Event, slotIndex: number): void {
    event.stopPropagation();
    
    if (slotIndex >= 0 && slotIndex < this.MAX_PHOTOS) {
      const photo = this.productPhotos[slotIndex];
      
      // Nettoyer l'URL de prévisualisation
      if (photo?.preview && photo.preview.startsWith('blob:')) {
        URL.revokeObjectURL(photo.preview);
      }
      
      // Optionnel : supprimer de Cloudinary si c'est une URL existante
      if (photo?.url) {
        this.cloudinaryService.deleteImage(photo.url).catch(error => {
          console.warn('Could not delete image from Cloudinary:', error);
        });
      }
      
      this.productPhotos[slotIndex] = null;
    }
  }
  
  // === DRAG & DROP ===
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }
  
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }
  
  onDropFiles(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = Array.from(event.dataTransfer?.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    for (const file of imageFiles) {
      const emptySlotIndex = this.productPhotos.findIndex(photo => photo === null);
      if (emptySlotIndex !== -1) {
        this.addPhotoToSlot(file, emptySlotIndex);
      } else {
        this.imageUploadError = 'Tous les slots sont remplis (maximum 5 photos)';
        break;
      }
    }
  }
  
  onSlotDragOver(event: DragEvent, slotIndex: number): void {
    event.preventDefault();
    this.dragTargetIndex = slotIndex;
  }
  
  onSlotDrop(event: DragEvent, slotIndex: number): void {
    event.preventDefault();
    this.dragTargetIndex = null;
    
    // Si c'est un fichier externe
    const files = Array.from(event.dataTransfer?.files || []);
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        this.addPhotoToSlot(file, slotIndex);
      }
      return;
    }
    
    // Si c'est un déplacement interne
    if (this.dragSourceIndex !== null && this.dragSourceIndex !== slotIndex) {
      this.swapPhotos(this.dragSourceIndex, slotIndex);
    }
    
    this.dragSourceIndex = null;
  }
  
  onDragStart(event: DragEvent, slotIndex: number): void {
    this.dragSourceIndex = slotIndex;
    event.dataTransfer?.setData('text/plain', slotIndex.toString());
  }
  
  // Échanger deux photos de place
  swapPhotos(sourceIndex: number, targetIndex: number): void {
    if (sourceIndex < 0 || sourceIndex >= this.MAX_PHOTOS || 
        targetIndex < 0 || targetIndex >= this.MAX_PHOTOS) {
      return;
    }
    
    const temp = this.productPhotos[sourceIndex];
    this.productPhotos[sourceIndex] = this.productPhotos[targetIndex];
    this.productPhotos[targetIndex] = temp;
    
    // Mettre à jour les types selon les nouvelles positions
    if (this.productPhotos[sourceIndex]) {
      this.productPhotos[sourceIndex]!.type = this.getPhotoTypeByIndex(sourceIndex) as any;
    }
    if (this.productPhotos[targetIndex]) {
      this.productPhotos[targetIndex]!.type = this.getPhotoTypeByIndex(targetIndex) as any;
    }
  }
  
  // === UPLOAD ET GESTION ===
  
  async uploadPhotos(): Promise<string[]> {
    const photosToUpload = this.productPhotos.filter(photo => photo?.file);
    
    if (photosToUpload.length === 0) {
      return this.getPhotoUrls();
    }
    
    this.uploadingImages = true;
    this.imageUploadError = null;
    
    try {
      const uploadPromises = this.productPhotos.map(async (photo, index) => {
        if (photo?.file) {
          const uploadedUrl = await this.cloudinaryService.uploadMultipleImages([photo.file]);
          this.productPhotos[index] = {
            ...photo,
            url: uploadedUrl[0],
            file: undefined // Nettoyer le fichier après upload
          };
          return uploadedUrl[0];
        } else if (photo?.url) {
          return photo.url;
        }
        return null;
      });
      
      const results = await Promise.all(uploadPromises);
      return results.filter(url => url !== null) as string[];
    } catch (error) {
      this.imageUploadError = 'Erreur lors de l\'upload des images';
      console.error('Upload error:', error);
      throw error;
    } finally {
      this.uploadingImages = false;
    }
  }
  
  getPhotoUrls(): string[] {
    return this.productPhotos
      .filter(photo => photo?.url)
      .map(photo => photo!.url!);
  }
  
  loadProductPhotosFromUrls(urls: string[]): void {
    this.resetPhotoSlots();
    
    urls.forEach((url, index) => {
      if (index < this.MAX_PHOTOS) {
        const photoType = this.getPhotoTypeByIndex(index) as any;
        this.productPhotos[index] = {
          url,
          type: photoType
        };
      }
    });
  }
  
  resetPhotoSlots(): void {
    // Nettoyer les URLs de prévisualisation
    this.productPhotos.forEach(photo => {
      if (photo?.preview && photo.preview.startsWith('blob:')) {
        URL.revokeObjectURL(photo.preview);
      }
    });
    
    this.productPhotos = [null, null, null, null, null];
    this.isDragOver = false;
    this.dragTargetIndex = null;
    this.dragSourceIndex = null;
    this.currentSlotTarget = null;
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
        const uploadedImageUrls = await this.uploadPhotos();
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
        const uploadedImageUrls = await this.uploadPhotos();
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
