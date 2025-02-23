const Product = require('../models/product.model');

// Obtenir tous les produits
const getAllProducts = async (req, res) => {
    try {
        console.log('Récupération de tous les produits...');
        const products = await Product.find();
        console.log(`${products.length} produits trouvés`);
        res.json(products);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un produit par son ID
const getProductById = async (req, res) => {
    try {
        console.log('Recherche du produit avec l\'ID:', req.params.id);
        const product = await Product.findById(req.params.id);
        if (product) {
            console.log('Produit trouvé:', product.name);
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
