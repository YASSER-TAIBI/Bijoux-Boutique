require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');
const orderRoutes = require('./routes/order.routes');
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
            getProductById: '/api/products/:id',
            register: '/api/users/register',
            login: '/api/users/login',
            profile: '/api/users/profile',
            wishlist: '/api/users/wishlist',
            createOrder: '/api/orders',
            getUserOrders: '/api/orders/user/:userId',
            getOrderById: '/api/orders/:id',
            updateOrderStatus: '/api/orders/:id/status'
        }
    });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Middleware d'erreur
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
