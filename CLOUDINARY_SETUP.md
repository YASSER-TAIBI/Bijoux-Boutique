# Configuration Cloudinary - Instructions

## 🚀 **Migration Firebase → Cloudinary terminée !**

La migration de Firebase Storage vers Cloudinary a été effectuée avec succès. Voici les étapes pour finaliser la configuration :

## 📋 **Étapes de configuration**

### 1. Créer un compte Cloudinary (gratuit)
- Rendez-vous sur [cloudinary.com](https://cloudinary.com)
- Créez un compte gratuit (25 GB de stockage, 25 000 transformations/mois)
- Notez vos identifiants : **Cloud Name**, **API Key**, **API Secret**

### 2. Configurer l'Upload Preset
Dans votre dashboard Cloudinary :
- Allez dans **Settings** → **Upload**
- Créez un nouveau **Upload Preset** :
  - **Preset name** : `bijoux-boutique`
  - **Signing Mode** : `Unsigned` (pour l'upload côté client)
  - **Folder** : `products` (optionnel, pour organiser)
  - **Access Mode** : `Public`
  - **Allowed formats** : `jpg,png,webp,jpeg`
  - **Max file size** : `10000000` (10MB)

### 3. Mettre à jour la configuration
Modifiez le fichier `frontend/src/app/config/cloudinary.config.ts` :

```typescript
export const cloudinaryConfig = {
  cloudName: 'votre-cloud-name', // Remplacez par votre Cloud Name
  apiKey: 'votre-api-key', // Remplacez par votre API Key
  apiSecret: 'votre-api-secret', // Côté serveur uniquement
  uploadPreset: 'bijoux-boutique', // Le preset créé à l'étape 2
  folder: 'products'
};
```

## ✅ **Changements effectués**

### Fichiers supprimés :
- ❌ `firebase.config.ts`
- ❌ `firebase-storage.service.ts`

### Fichiers créés :
- ✅ `cloudinary.config.ts` - Configuration Cloudinary
- ✅ `cloudinary-storage.service.ts` - Service de gestion des images

### Fichiers modifiés :
- ✅ `products.component.ts` - Migration des appels Firebase → Cloudinary

## 🔧 **Fonctionnalités disponibles**

Le service Cloudinary offre :
- ✅ **Upload multiple d'images** (max 5 par produit)
- ✅ **Validation des fichiers** (format, taille)
- ✅ **Redimensionnement automatique** côté client
- ✅ **Optimisation automatique** (format WebP, compression)
- ✅ **URLs sécurisées** avec transformations
- ✅ **Suppression d'images** (côté serveur recommandé)

## 🎯 **Avantages de Cloudinary**

- **Gratuit** : 25 GB de stockage (vs Firebase payant)
- **Performance** : CDN mondial intégré
- **Optimisation** : Compression et formats automatiques
- **Transformations** : Redimensionnement à la volée
- **Sécurité** : URLs signées et contrôle d'accès

## 🚨 **Important**

1. **Ne jamais exposer l'API Secret** côté client
2. **Utiliser un Upload Preset unsigned** pour la sécurité
3. **Configurer les restrictions** (formats, taille) dans Cloudinary
4. **Implémenter la suppression côté serveur** pour la sécurité

## 📝 **Prochaines étapes**

1. Créer le compte Cloudinary
2. Configurer l'Upload Preset
3. Mettre à jour `cloudinary.config.ts`
4. Tester l'upload d'images dans l'admin
5. (Optionnel) Implémenter la suppression côté backend

## 🔍 **Test de fonctionnement**

Une fois configuré :
1. Lancez l'application : `npm start`
2. Allez dans Admin → Produits
3. Créez un nouveau produit
4. Uploadez des images dans la section "Photos du produit"
5. Vérifiez que les images apparaissent dans votre dashboard Cloudinary

---

**Migration terminée avec succès ! 🎉**
