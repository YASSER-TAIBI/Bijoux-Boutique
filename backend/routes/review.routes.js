const express = require('express');
const router = express.Router();
const {
  createReview,
  getProductReviews,
  getAllReviews,
  updateReviewVisibility,
  deleteReview,
  getProductRatingStats
} = require('../controllers/review.controller');

const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Routes publiques
router.post('/', createReview); // Créer un avis
router.get('/product/:productId', getProductReviews); // Récupérer les avis d'un produit
router.get('/product/:productId/stats', getProductRatingStats); // Statistiques de notation

// Routes admin (protégées)
router.get('/admin/all', authenticateToken, requireAdmin, getAllReviews); // Tous les avis pour admin
router.patch('/admin/:reviewId/visibility', authenticateToken, requireAdmin, updateReviewVisibility); // Modération
router.delete('/admin/:reviewId', authenticateToken, requireAdmin, deleteReview); // Supprimer un avis

module.exports = router;
