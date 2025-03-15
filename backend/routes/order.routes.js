const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Appliquer le middleware d'authentification à toutes les routes
router.use(verifyToken);

// Créer une nouvelle commande
router.post('/', orderController.createOrder);

// Obtenir toutes les commandes d'un utilisateur
router.get('/user/:userId', orderController.getUserOrders);

// Obtenir une commande spécifique
router.get('/:id', orderController.getOrderById);

// Mettre à jour le statut d'une commande
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
