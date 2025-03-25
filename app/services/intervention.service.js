const Intervention = require('../models/intervention.model');
const logger = require('../../utils/logger');

// Trouver les interventions en cours
exports.findOngoingInterventions = async () => {
    logger.info('Recherche des interventions en cours...');
    const liste = await Intervention.find({ status: 'en cours' }).populate('rendezVousId services.serviceId pieces.pieceId');
    return {
        liste: liste,
        nombre: liste.length
    };
};

// Créer une intervention
exports.createIntervention = async (interventionData) => {
    logger.info(`Création d'une intervention avec les données: ${JSON.stringify(interventionData)}`);
    const intervention = new Intervention(interventionData);
    return await intervention.save();
};

// Lire toutes les interventions
exports.getInterventions = async () => {
    logger.info('Récupération de toutes les interventions');
    return Intervention.find().populate('rendezVousId services.serviceId pieces.pieceId');
};

exports.getInterventionById = async (id) => {
    logger.info('Récupération de toutes les interventions');
    return Intervention.find({ _id : id }).populate('rendezVousId services.serviceId pieces.pieceId');
};

exports.getNumberOfIntervention = async () => {
    var listeencours = await Intervention.find({ status: "en cours" });
    var listefacturee = await Intervention.find({ status: "facturee" });
    var listeterminee = await Intervention.find({ status: "terminee" });

    logger.info('Récupération de toutes les interventions');

    return { 
        encours: listeencours.length || 0, 
        facturee: listefacturee.length || 0, 
        terminee: listeterminee.length || 0
    };
};


// Mettre à jour une intervention
exports.updateIntervention = async (id, interventionData) => {
    logger.info(`Mise à jour de l'intervention avec ID: ${id}`);
    return Intervention.findByIdAndUpdate(id, interventionData, { new: true }).populate('rendezVousId services.serviceId pieces.pieceId');
};

// Supprimer une intervention
exports.deleteIntervention = async (id) => {
    logger.info(`Suppression de l'intervention avec ID: ${id}...`);
    return Intervention.findByIdAndDelete(id);
};

// Mettre à jour l'état d'un service dans une intervention
exports.updateServiceStatus = async (id, serviceId, etat) => {
    logger.info(`Mise à jour de l'état du service ${serviceId} dans l'intervention ${id} en ${etat}`);
    return Intervention.findOneAndUpdate(
        { _id: id, 'services.serviceId': serviceId },
        { $set: { 'services.$.etat': etat } },
        { new: true }
    ).populate('rendezVousId services.serviceId pieces.pieceId');
};

// Mettre à jour la quantité d'une pièce dans une intervention
exports.updatePieceQuantity = async (id, pieceId, quantite) => {
    logger.info(`Mise à jour de la quantité de la pièce ${pieceId} dans l'intervention ${id} à ${quantite}`);
    return Intervention.findOneAndUpdate(
        { _id: id, 'pieces.pieceId': pieceId },
        { $set: { 'pieces.$.quantite': quantite } },
        { new: true }
    ).populate('rendezVousId services.serviceId pieces.pieceId');
};

// Finaliser une intervention
exports.finalizeIntervention = async (id) => {
    logger.info(`Finalisation de l'intervention avec ID: ${id}`);
    return Intervention.findByIdAndUpdate(id, { status: 'terminee' }, { new: true }).populate('rendezVousId services.serviceId pieces.pieceId');
};

