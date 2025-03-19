const interventionService = require('../services/intervention.service');

exports.createIntervention = async (req, res) => {
    try {
        const intervention = await interventionService.createIntervention(req.body);
        res.status(201).json(intervention);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'intervention", error: error.message });
    }
};

exports.getInterventions = async (req, res) => {
    try {
        const interventions = await interventionService.getInterventions();
        res.status(200).json(interventions);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des interventions", error: error.message });
    }
};

exports.getInterventionById = async (req, res) => {
    try {
        const intervention = await interventionService.getInterventionById(req.params.id);
        if (!intervention) {
            return res.status(404).json({ message: "Intervention non trouvée" });
        }
        res.status(200).json(intervention);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'intervention", error: error.message });
    }
};

exports.updateIntervention = async (req, res) => {
    try {
        const intervention = await interventionService.updateIntervention(req.params.id, req.body);
        if (!intervention) {
            return res.status(404).json({ message: "Intervention non trouvée" });
        }
        res.status(200).json(intervention);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'intervention", error: error.message });
    }
};

exports.deleteIntervention = async (req, res) => {
    try {
        const intervention = await interventionService.deleteIntervention(req.params.id);
        if (!intervention) {
            return res.status(404).json({ message: "Intervention non trouvée" });
        }
        res.status(200).json({ message: "Intervention supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'intervention", error: error.message });
    }
};

exports.findOngoingInterventions = async (req, res) => {
    try {
        const interventions = await interventionService.findOngoingInterventions();
        res.status(200).json(interventions);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des interventions en cours", error: error.message });
    }
};

exports.updateServiceStatus = async (req, res) => {
    try {
        const { interventionId, serviceId, status } = req.body;
        const intervention = await interventionService.updateServiceStatus(interventionId, serviceId, status);
        res.status(200).json(intervention);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du statut du service", error: error.message });
    }
};

exports.updatePieceQuantity = async (req, res) => {
    try {
        const { interventionId, pieceId, quantity } = req.body;
        const intervention = await interventionService.updatePieceQuantity(interventionId, pieceId, quantity);
        res.status(200).json(intervention);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la quantité de la pièce", error: error.message });
    }
};

exports.finalizeIntervention = async (req, res) => {
    try {
        const intervention = await interventionService.finalizeIntervention(req.params.id);
        res.status(200).json(intervention);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la finalisation de l'intervention", error: error.message });
    }
};