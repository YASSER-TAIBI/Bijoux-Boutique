const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        console.log('Tentative d\'inscription:', { name, email, phone, address });

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Utilisateur existe déjà:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role: "user"
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
        console.log('Récupération du profil pour userId:', req.user.userId);
        
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

        console.log('Profil récupéré pour:', user._id);
        res.json({
            id: user._id,
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
        const { name, phone, address } = req.body;
        console.log('Mise à jour du profil pour:', req.user.userId);

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                $set: {
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

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        console.log('Ajout d\'un produit à la wishlist pour:', req.user.userId);
        
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $addToSet: { wishlist: productId } },
            { new: true }
        ).select('-password');

        console.log('Produit ajouté à la wishlist pour:', user._id);
        res.json({ message: 'Product added to wishlist', user });
    } catch (error) {
        console.error('Erreur d\'ajout à la wishlist:', error);
        res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
    }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        console.log('Suppression d\'un produit de la wishlist pour:', req.user.userId);
        
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $pull: { wishlist: productId } },
            { new: true }
        ).select('-password');

        console.log('Produit supprimé de la wishlist pour:', user._id);
        res.json({ message: 'Product removed from wishlist', user });
    } catch (error) {
        console.error('Erreur de suppression de la wishlist:', error);
        res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
    }
};

// Get user's wishlist
exports.getWishlist = async (req, res) => {
    try {
        console.log('Récupération de la wishlist pour:', req.user.userId);
        
        const user = await User.findById(req.user.userId)
            .select('wishlist')
            .populate('wishlist');

        console.log('Wishlist récupérée pour:', user._id);
        res.json(user.wishlist);
    } catch (error) {
        console.error('Erreur de récupération de la wishlist:', error);
        res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
    }
};
