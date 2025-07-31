const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);
router.post('/wishlist', authenticateToken, userController.addToWishlist);
router.delete('/wishlist/:productId', authenticateToken, userController.removeFromWishlist);
router.get('/wishlist', authenticateToken, userController.getWishlist);

// Admin routes (protected by auth middleware, admin check in controller)
router.get('/admin/all', authenticateToken, requireAdmin, userController.getAllUsers);
router.post('/admin/create', authenticateToken, requireAdmin, userController.createUser);
router.put('/admin/:userId', authenticateToken, requireAdmin, userController.updateUser);
router.delete('/admin/:userId', authenticateToken, requireAdmin, userController.deleteUser);
router.patch('/admin/:userId/role', authenticateToken, requireAdmin, userController.updateUserRole);

module.exports = router;
