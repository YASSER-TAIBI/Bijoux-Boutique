const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.post('/wishlist', auth, userController.addToWishlist);
router.delete('/wishlist/:productId', auth, userController.removeFromWishlist);
router.get('/wishlist', auth, userController.getWishlist);

// Admin routes (protected by auth middleware, admin check in controller)
router.get('/admin/all', auth, userController.getAllUsers);
router.post('/admin/create', auth, userController.createUser);
router.put('/admin/:userId', auth, userController.updateUser);
router.delete('/admin/:userId', auth, userController.deleteUser);
router.patch('/admin/:userId/role', auth, userController.updateUserRole);

module.exports = router;
