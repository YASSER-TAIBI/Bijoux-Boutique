require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const productRoutes = require('./routes/product.routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données
connectDB();

// Route racine
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API de Bijoux Boutique',
        endpoints: {
            getAllProducts: '/api/products',
            getProductById: '/api/products/:id'
        }
    });
});

// Routes
app.use('/api/products', productRoutes);

// Middleware d'erreur
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
