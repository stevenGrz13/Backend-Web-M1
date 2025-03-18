const SousIntervention = require('../models/sousintervention.model');
const Intervention = require('../models/intervention.model');

exports.createSousIntervention = async (req, res) => {
    try {
        const { interventionId } = req.params;
        const sousIntervention = new SousIntervention({ ...req.body, interventionId });

        await sousIntervention.save();
        await Intervention.findByIdAndUpdate(interventionId, { $push: { sousInterventions: sousIntervention._id } });

        res.status(201).json(sousIntervention);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la sous-intervention", error: error.message });
    }
};

exports.getSousInterventions = async (req, res) => {
    try {
        const { interventionId } = req.params;
        const sousInterventions = await SousIntervention.find({ interventionId });

        res.status(200).json(sousInterventions);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des sous-interventions", error: error.message });
    }
};

exports.updateSousIntervention = async (req, res) => {
    try {
        const sousIntervention = await SousIntervention.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sousIntervention) {
            return res.status(404).json({ message: "Sous-intervention non trouvée" });
        }
        res.status(200).json(sousIntervention);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la sous-intervention", error: error.message });
    }
};

exports.deleteSousIntervention = async (req, res) => {
    try {
        const sousIntervention = await SousIntervention.findByIdAndDelete(req.params.id);
        if (!sousIntervention) {
            return res.status(404).json({ message: "Sous-intervention non trouvée" });
        }
        await Intervention.findByIdAndUpdate(sousIntervention.interventionId, { $pull: { sousInterventions: req.params.id } });

        res.status(200).json({ message: "Sous-intervention supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la sous-intervention", error: error.message });
    }
};