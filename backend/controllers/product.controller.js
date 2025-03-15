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

module.exports = {
    getAllProducts,
    getProductById
};
