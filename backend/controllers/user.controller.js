const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { civility, name, email, password, phone, address } = req.body;
        console.log('Tentative d\'inscription:', { civility, name, email, phone, address });

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Utilisateur existe déjà:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user (password will be hashed by the pre-save middleware)
        const user = new User({
            civility,
            name,
            email,
            password, // Le mot de passe sera haché automatiquement par le middleware
            phone,
            address,
            role: "user",
            wishlist: [] // Initialiser la wishlist comme un tableau vide
        });

        await user.save();
        console.log('Nouvel utilisateur créé:', user._id);

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Token généré pour:', user._id);

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                civility: user.civility,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erreur d\'inscription:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Tentative de connexion:', email);

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Utilisateur non trouvé:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Mot de passe incorrect pour:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Connexion réussie pour:', user._id);
        console.log('Token généré:', token);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erreur de connexion:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {

        if (!req.user || !req.user.userId) {
            console.error('Pas d\'ID utilisateur dans la requête');
            return res.status(401).json({ message: 'User ID not found in request' });
        }

        const user = await User.findById(req.user.userId)
            .select('-password');

        if (!user) {
            console.log('Profil non trouvé pour:', req.user.userId);
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            id: user._id,
            civility: user.civility,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role
        });
    } catch (error) {
        console.error('Erreur de récupération du profil:', error);
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { civility, name, phone, address } = req.body;
        console.log('Mise à jour du profil pour:', req.user.userId);

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                $set: {
                    civility,
                    name,
                    phone,
                    address
                }
            },
            { new: true }
        ).select('-password');

        if (!user) {
            console.log('Profil non trouvé pour:', req.user.userId);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Profil mis à jour pour:', user._id);
        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                civility: user.civility,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erreur de mise à jour du profil:', error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Get user's wishlist
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json(user.wishlist.map(id => id.toString()) || []);
    } catch (error) {
        console.error('Erreur lors de la récupération de la wishlist:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        console.log('Tentative d\'ajout du produit:', productId);

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        if (!user.wishlist) {
            user.wishlist = [];
        }

        // Vérifier si le produit est déjà dans la wishlist
        const exists = user.wishlist.some(id => id.toString() === productId);
        
        if (!exists) {
            user.wishlist.push(productId);
            await user.save();
            console.log('Produit ajouté avec succès');
        } else {
            console.log('Produit déjà dans la wishlist');
        }

        // Retourner la wishlist mise à jour
        const updatedUser = await User.findById(req.user.userId);
        res.json(updatedUser.wishlist.map(id => id.toString()));
    } catch (error) {
        console.error('Erreur lors de l\'ajout aux favoris:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const productId = req.params.productId;

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier si le produit est dans la wishlist
        const productIndex = user.wishlist.findIndex(id => id.toString() === productId);

        if (productIndex !== -1) {
            // Supprimer le produit de la wishlist en utilisant splice
            user.wishlist.splice(productIndex, 1);
            await user.save();
        } else {
            console.log('Produit non trouvé dans la wishlist');
        }

        // Retourner la wishlist mise à jour
        const updatedUser = await User.findById(req.user.userId);
        res.json(updatedUser.wishlist.map(id => id.toString()));
    } catch (error) {
        console.error('Erreur lors de la suppression des favoris:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// ===== ADMIN USER MANAGEMENT ENDPOINTS =====

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        // Vérifier que l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
        }

        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        
        // Séparer les utilisateurs par rôle
        const admins = users.filter(user => user.role === 'admin');
        const regularUsers = users.filter(user => user.role === 'user');

        res.json({
            admins,
            users: regularUsers,
            total: users.length
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Create user (Admin only)
exports.createUser = async (req, res) => {
    try {
        // Vérifier que l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
        }

        const { civility, name, email, password, phone, address, role = 'user' } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
        }

        // Créer le nouvel utilisateur
        const user = new User({
            civility,
            name,
            email,
            password, // Le mot de passe sera haché automatiquement par le middleware
            phone,
            address,
            role,
            wishlist: []
        });

        await user.save();

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: {
                id: user._id,
                civility: user.civility,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Update user (Admin only)
exports.updateUser = async (req, res) => {
    try {
        // Vérifier que l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
        }

        const userId = req.params.userId;
        const { civility, name, email, phone, address, role } = req.body;

        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé par un autre utilisateur' });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    civility,
                    name,
                    email,
                    phone,
                    address,
                    role
                }
            },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json({
            message: 'Utilisateur mis à jour avec succès',
            user: {
                id: updatedUser._id,
                civility: updatedUser.civility,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt
            }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        // Vérifier que l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
        }

        const userId = req.params.userId;

        // Empêcher la suppression de son propre compte
        if (userId === req.user.userId) {
            return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json({
            message: 'Utilisateur supprimé avec succès',
            deletedUser: {
                id: deletedUser._id,
                name: deletedUser.name,
                email: deletedUser.email
            }
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Update user role (Admin only)
exports.updateUserRole = async (req, res) => {
    try {
        // Vérifier que l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
        }

        const userId = req.params.userId;
        const { role } = req.body;

        // Valider le rôle
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Rôle invalide. Utilisez "user" ou "admin"' });
        }

        // Empêcher la modification de son propre rôle
        if (userId === req.user.userId) {
            return res.status(400).json({ message: 'Vous ne pouvez pas modifier votre propre rôle' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { role } },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json({
            message: 'Rôle utilisateur mis à jour avec succès',
            user: {
                id: updatedUser._id,
                civility: updatedUser.civility,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du rôle:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};
