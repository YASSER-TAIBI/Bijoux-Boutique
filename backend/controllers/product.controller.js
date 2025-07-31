const Product = require('../models/product.model');

// Obtenir tous les produits
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un produit par son ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            console.log('Aucun produit trouvé avec cet ID');
            res.status(404).json({ message: 'Produit non trouvé' });
        }
    } catch (error) {
        console.error('Erreur lors de la recherche du produit:', error);
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouveau produit (Admin uniquement)
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, images, material, stock, isAvailable } = req.body;
        
        // Validation des données requises
        if (!name || !description || !price || !category || !material || stock === undefined) {
            return res.status(400).json({ 
                message: 'Tous les champs obligatoires doivent être renseignés' 
            });
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            images: images || [],
            material,
            stock,
            isAvailable: isAvailable !== undefined ? isAvailable : true
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Erreur lors de la création du produit:', error);
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un produit (Admin uniquement)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        res.json(product);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit:', error);
        res.status(500).json({ message: error.message });
    }
};

// Supprimer un produit (Admin uniquement)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        res.json({ message: 'Produit supprimé avec succès', product });
    } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        res.status(500).json({ message: error.message });
    }
};

// Obtenir les produits par catégorie
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });
        res.json(products);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits par catégorie:', error);
        res.status(500).json({ message: error.message });
    }
};

// Rechercher des produits
const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        const searchRegex = new RegExp(q, 'i');
        
        const products = await Product.find({
            $or: [
                { name: searchRegex },
                { description: searchRegex },
                { material: searchRegex }
            ]
        });
        
        res.json(products);
    } catch (error) {
        console.error('Erreur lors de la recherche de produits:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    searchProducts
};
