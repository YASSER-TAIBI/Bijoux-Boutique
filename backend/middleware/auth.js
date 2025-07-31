const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            console.error('Pas d\'en-tête d\'autorisation');
            return res.status(401).json({ message: 'No authorization header' });
        }

        if (!authHeader.startsWith('Bearer ')) {
            console.error('Format de token invalide');
            return res.status(401).json({ message: 'Invalid token format' });
        }

        // Get token from header
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            console.error('Pas de token trouvé');
            return res.status(401).json({ message: 'No token found' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Add user data to request
            req.user = decoded;
            next();
        } catch (jwtError) {
            console.error('Erreur de vérification du token:', jwtError);
            return res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

// Middleware pour vérifier que l'utilisateur est admin
const requireAdmin = (req, res, next) => {
    try {
        // Vérifier que l'utilisateur est authentifié
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Vérifier que l'utilisateur a le rôle admin
        if (req.user.role !== 'admin') {
            console.log('Tentative d\'accès admin par utilisateur non-admin:', req.user.email);
            return res.status(403).json({ message: 'Admin access required' });
        }

        next();
    } catch (error) {
        console.error('Erreur de vérification admin:', error);
        res.status(500).json({ message: 'Server error during admin verification' });
    }
};

module.exports = {
    authenticateToken,
    requireAdmin
};
