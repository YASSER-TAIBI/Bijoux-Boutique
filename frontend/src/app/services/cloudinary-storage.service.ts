import { Injectable } from '@angular/core';
import { cloudinaryClientConfig } from '../config/cloudinary.config';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryStorageService {

  constructor() { }

  /**
   * Upload multiple images to Cloudinary
   * @param files Array of files to upload
   * @returns Promise with array of download URLs
   */
  async uploadMultipleImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadSingleImage(file));
    return Promise.all(uploadPromises);
  }

  /**
   * Upload a single image to Cloudinary
   * @param file File to upload
   * @returns Promise with download URL
   */
  async uploadSingleImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryClientConfig.uploadPreset);
      formData.append('folder', cloudinaryClientConfig.folder);
      
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      formData.append('public_id', `${cloudinaryClientConfig.folder}/${fileName}`);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryClientConfig.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw new Error('Erreur lors de l\'upload de l\'image');
    }
  }

  /**
   * Delete an image from Cloudinary
   * @param imageUrl URL of the image to delete
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract public_id from Cloudinary URL
      const publicId = this.extractPublicIdFromUrl(imageUrl);
      
      if (!publicId) {
        console.warn('Could not extract public_id from URL:', imageUrl);
        return;
      }

      // Note: La suppression via API nécessite une signature côté serveur
      // Pour la sécurité, cette opération devrait être faite côté backend
      console.log('Image deletion should be handled server-side for security:', publicId);
      
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw new Error('Erreur lors de la suppression de l\'image');
    }
  }

  /**
   * Extract public_id from Cloudinary URL
   * @param url Cloudinary image URL
   * @returns public_id or null
   */
  private extractPublicIdFromUrl(url: string): string | null {
    try {
      const urlParts = url.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      
      if (uploadIndex === -1) return null;
      
      // Get everything after /upload/v{version}/
      const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
      
      // Remove file extension
      const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
      
      return publicId;
    } catch (error) {
      console.error('Error extracting public_id:', error);
      return null;
    }
  }

  /**
   * Validate file type and size
   * @param file File to validate
   * @returns validation result
   */
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Format non supporté. Utilisez JPG, PNG ou WebP.'
      };
    }

    // Check file size (max 10MB - Cloudinary free tier limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'L\'image est trop volumineuse. Taille maximum : 10MB.'
      };
    }

    return { isValid: true };
  }

  /**
   * Generate optimized Cloudinary URL with transformations
   * @param publicId Public ID of the image
   * @param transformations Cloudinary transformations
   * @returns Optimized image URL
   */
  getOptimizedImageUrl(publicId: string, transformations: string = 'w_800,h_600,c_fill,f_auto,q_auto'): string {
    return `https://res.cloudinary.com/${cloudinaryClientConfig.cloudName}/image/upload/${transformations}/${publicId}`;
  }

  /**
   * Resize and optimize image before upload (client-side)
   * @param file Original file
   * @param maxWidth Maximum width
   * @param maxHeight Maximum height
   * @param quality Image quality (0-1)
   * @returns Promise with resized file
   */
  async resizeImage(file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(resizedFile);
          } else {
            resolve(file);
          }
        }, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }
}
