// Configuration Cloudinary
export const cloudinaryConfig = {
  cloudName: 'dment3okg', // À remplacer par votre cloud name Cloudinary
  apiKey: '478136269456118', // À remplacer par votre API key
  apiSecret: '3HIHshF5KiXrbSfkLbyQZX0ZpuI', // À remplacer par votre API secret (côté serveur uniquement)
  uploadPreset: 'bijoux-boutique', // Preset d'upload à créer dans Cloudinary
  folder: 'products' // Dossier pour organiser les images
};

// Configuration pour l'upload côté client (sans API secret pour la sécurité)
export const cloudinaryClientConfig = {
  cloudName: cloudinaryConfig.cloudName,
  apiKey: cloudinaryConfig.apiKey,
  uploadPreset: cloudinaryConfig.uploadPreset,
  folder: cloudinaryConfig.folder
};
