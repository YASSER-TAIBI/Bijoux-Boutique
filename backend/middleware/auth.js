const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
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
            console.log('Token vérifié pour userId:', decoded.userId);
            
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
