const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Route pour obtenir tous les produits
router.get('/', productController.getAllProducts);

// Route pour obtenir un produit par son ID
router.get('/:id', productController.getProductById);

module.exports = router;
