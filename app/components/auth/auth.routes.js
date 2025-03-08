// src/components/auth/auth.routes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { jwtSecret } = process.env.JWT_SECRET;
const User = require('../user/user.model'); // Exemple de modèle utilisateur

// Route de connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Vérifier les informations de connexion (exemple simplifié)
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
        return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Générer un token JWT
    const token = jwt.sign(
        { userId: user._id, role: user.role }, // Données à inclure dans le token
        jwtSecret,
        { expiresIn: '1h' } // Durée de validité du token
    );

    res.json({ token });
});

module.exports = router;
