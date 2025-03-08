// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { jwtSecret } = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    // Récupérer le token depuis l'en-tête Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, jwtSecret);

        // Ajouter les informations de l'utilisateur à l'objet req
        req.user = decoded;

        // Passer au middleware ou au contrôleur suivant
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
