const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  date: {
    type: Date,
    default: Date.now
  },
  // Champs optionnels pour une meilleure fonctionnalité
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false // Optionnel si les avis peuvent être généraux
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optionnel pour permettre les avis anonymes
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

// Index pour améliorer les performances des requêtes
reviewSchema.index({ productId: 1, date: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isVisible: 1 });

// Méthode pour formater la date d'affichage
reviewSchema.methods.getFormattedDate = function() {
  return this.date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Méthode statique pour calculer la note moyenne d'un produit
reviewSchema.statics.getAverageRating = async function(productId) {
  try {
    const mongoose = require('mongoose');
    const objectId = typeof productId === 'string' ? new mongoose.Types.ObjectId(productId) : productId;
    
    const result = await this.aggregate([
      { $match: { productId: objectId, isVisible: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
    
    if (result.length > 0) {
      return {
        averageRating: Math.round(result[0].averageRating * 10) / 10, // Arrondi à 1 décimale
        totalReviews: result[0].totalReviews
      };
    }
    
    return { averageRating: 0, totalReviews: 0 };
  } catch (error) {
    console.error('Erreur dans getAverageRating:', error);
    return { averageRating: 0, totalReviews: 0 };
  }
};

module.exports = mongoose.model('Review', reviewSchema);
