const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    try {
        // Récupérer le token du header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token d\'authentification manquant' });
        }

        const token = authHeader.split(' ')[1];
        
        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Ajouter les informations de l'utilisateur à la requête
        req.user = {
            id: decoded.userId
        };
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expiré' });
        }
        return res.status(401).json({ message: 'Token invalide' });
    }
};
