const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Routes publiques - ORDRE IMPORTANT : routes spécifiques avant routes avec paramètres
// Route pour obtenir tous les produits
router.get('/', productController.getAllProducts);

// Route pour rechercher des produits (AVANT /:id)
router.get('/search', productController.searchProducts);

// Route pour obtenir les produits par catégorie (AVANT /:id)
router.get('/category/:category', productController.getProductsByCategory);

// Route pour obtenir un produit par son ID (APRÈS les routes spécifiques)
router.get('/:id', productController.getProductById);

// Routes admin (protégées)
// Route pour créer un nouveau produit
router.post('/admin', authenticateToken, requireAdmin, productController.createProduct);

// Route pour mettre à jour un produit
router.put('/admin/:id', authenticateToken, requireAdmin, productController.updateProduct);

// Route pour supprimer un produit
router.delete('/admin/:id', authenticateToken, requireAdmin, productController.deleteProduct);

module.exports = router;
