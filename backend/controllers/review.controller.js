const Review = require('../models/review.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

// Créer un nouvel avis
const createReview = async (req, res) => {
  try {
    const { userName, email, rating, comment, productId } = req.body;

    // Validation des champs requis
    if (!userName || !email || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Validation de la note
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'La note doit être comprise entre 1 et 5'
      });
    }

    // Vérifier que le produit existe si productId est fourni
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
      }
    }

    // Créer le nouvel avis
    const newReview = new Review({
      userName: userName.trim(),
      email: email.trim().toLowerCase(),
      rating: parseInt(rating),
      comment: comment.trim(),
      productId: productId || null,
      userId: req.user ? req.user.id : null // Si l'utilisateur est connecté
    });

    const savedReview = await newReview.save();

    res.status(201).json({
      success: true,
      message: 'Avis ajouté avec succès',
      review: savedReview
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'avis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de l\'avis'
    });
  }
};

// Récupérer tous les avis d'un produit
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ 
      productId: productId,
      isVisible: true 
    }).sort({ date: -1 });

    // Calculer les statistiques
    const averageRating = await Review.getAverageRating(productId);

    res.json({
      success: true,
      reviews,
      statistics: averageRating
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des avis'
    });
  }
};

// Récupérer tous les avis (pour l'admin)
const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find()
      .populate('productId', 'name')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments();

    res.json({
      success: true,
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de tous les avis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des avis'
    });
  }
};

// Mettre à jour la visibilité d'un avis (modération)
const updateReviewVisibility = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { isVisible } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { isVisible },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    res.json({
      success: true,
      message: `Avis ${isVisible ? 'rendu visible' : 'masqué'} avec succès`,
      review
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'avis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour de l\'avis'
    });
  }
};

// Supprimer un avis
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Avis non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Avis supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'avis:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de l\'avis'
    });
  }
};

// Obtenir les statistiques de notation pour un produit
const getProductRatingStats = async (req, res) => {
  try {
    const { productId } = req.params;

    const stats = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId), isVisible: true } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    const totalReviews = await Review.countDocuments({ 
      productId: productId, 
      isVisible: true 
    });

    // Formater les statistiques pour le frontend
    const ratingStats = {};
    for (let i = 1; i <= 5; i++) {
      const stat = stats.find(s => s._id === i);
      ratingStats[i] = {
        count: stat ? stat.count : 0,
        percentage: totalReviews > 0 ? Math.round((stat ? stat.count : 0) / totalReviews * 100) : 0
      };
    }

    res.json({
      success: true,
      ratingStats,
      totalReviews
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques'
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getAllReviews,
  updateReviewVisibility,
  deleteReview,
  getProductRatingStats
};
