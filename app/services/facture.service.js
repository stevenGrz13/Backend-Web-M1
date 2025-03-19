const Facture = require('../models/facture.model');
const logger = require('../../utils/logger');

exports.findEmptyFacture = async (factureData) => {
    logger.info(`Création d'une facture avec les données: ${JSON.stringify(factureData)}`);
    const liste = await Facture.find({ where: { quantite: 0 } });
    return {
        liste: liste,
        nombre: liste.length
    };
};

// Créer une facture
exports.createFacture = async (factureData) => {
    logger.info(`Création d'une facture avec les données: ${JSON.stringify(factureData)}`);
    const facture = new Facture(factureData);
    return await facture.save();
};

// Lire toutes les factures
exports.getFactures = async () => {
    logger.info('Récupération de toutes les factures');
    return Facture.find();
};

// Mettre à jour une facture
exports.updateFacture = async (id, factureData) => {
    logger.info(`Mise à jour de la facture avec ID: ${id}`);
    return Facture.findByIdAndUpdate(id, factureData, { new: true });
};

// Supprimer une facture
exports.deleteFacture = async (id) => {
    logger.info(`Suppression de la facture avec ID: ${id}...`);
    return Facture.findByIdAndDelete(id);
};
