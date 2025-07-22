const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jalorine_database');
        console.log('✅ Connecté à MongoDB');
        return conn;
    } catch (error) {
        console.error('❌ Erreur de connexion à MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
