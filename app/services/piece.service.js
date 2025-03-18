const Piece = require('../models/piece.model');
const logger = require('../../utils/logger');

exports.findEmptyPiece = async (articleData) => {
    logger.info(`Création d'une pièce avec les données: ${JSON.stringify(articleData)}`);
    const liste = await Piece.find({ where : { quantite : 0 } });
    return {
        liste : liste,
        nombre : liste.length
    };
};

// Créer une pièce
exports.createPiece = async (articleData) => {
    logger.info(`Création d'une pièce avec les données: ${JSON.stringify(articleData)}`);
    const article = new Piece(articleData);
    return await article.save();
};

// Lire toutes les pièces
exports.getPieces = async () => {
    logger.info('Récupération de toutes les pièces');
    return Piece.find();
};

// Mettre à jour une pièce
exports.updatePiece = async (id, articleData) => {
    logger.info(`Mise à jour de la pièce avec ID: ${id}`);
    return Piece.findByIdAndUpdate(id, articleData, { new: true });
};

// Supprimer une pièce
exports.deletePiece = async (id) => {
    logger.info(`Suppression de la pièce avec ID: ${id}...`);
    return Piece.findByIdAndDelete(id);
};
