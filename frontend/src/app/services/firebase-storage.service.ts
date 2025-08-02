import { Injectable } from '@angular/core';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  constructor() { }

  /**
   * Upload multiple images to Firebase Storage
   * @param files Array of files to upload
   * @param folderPath Path in Firebase Storage (e.g., 'products/')
   * @returns Promise with array of download URLs
   */
  async uploadMultipleImages(files: File[], folderPath: string = 'products/'): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadSingleImage(file, folderPath));
    return Promise.all(uploadPromises);
  }

  /**
   * Upload a single image to Firebase Storage
   * @param file File to upload
   * @param folderPath Path in Firebase Storage
   * @returns Promise with download URL
   */
  async uploadSingleImage(file: File, folderPath: string = 'products/'): Promise<string> {
    try {
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = `${folderPath}${fileName}`;
      
      // Create storage reference
      const storageRef = ref(storage, filePath);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Erreur lors de l\'upload de l\'image');
    }
  }

  /**
   * Delete an image from Firebase Storage
   * @param imageUrl URL of the image to delete
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract path from URL
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
      
      if (pathMatch) {
        const filePath = decodeURIComponent(pathMatch[1]);
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Erreur lors de la suppression de l\'image');
    }
  }

  /**
   * Validate file type and size
   * @param file File to validate
   * @returns boolean indicating if file is valid
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

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'L\'image est trop volumineuse. Taille maximum : 5MB.'
      };
    }

    return { isValid: true };
  }

  /**
   * Resize image before upload (optional utility)
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
