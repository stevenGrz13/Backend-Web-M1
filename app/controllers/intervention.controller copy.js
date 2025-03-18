const Intervention = require('../models/intervention.model');

exports.createIntervention = async (req, res) => {
    try {
        const intervention = new Intervention(req.body);
        await intervention.save();
        res.status(201).json(intervention);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'intervention", error: error.message });
    }
};

exports.getInterventions = async (req, res) => {
    try {
        const interventions = await Intervention.find().populate('sousInterventions');
        res.status(200).json(interventions);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des interventions", error: error.message });
    }
};

exports.getInterventionById = async (req, res) => {
    try {
        const intervention = await Intervention.findById(req.params.id).populate('sousInterventions');
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
        const intervention = await Intervention.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
        const intervention = await Intervention.findByIdAndDelete(req.params.id);
        if (!intervention) {
            return res.status(404).json({ message: "Intervention non trouvée" });
        }
        res.status(200).json({ message: "Intervention supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'intervention", error: error.message });
    }
};
