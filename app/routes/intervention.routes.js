const express = require('express');
const router = express.Router();
const interventionController = require('../controllers/intervention.controller');
const sousInterventionController = require('../controllers/sousIntervention.controller');

// Routes pour les interventions
router.post('/', interventionController.createIntervention);
router.get('/', interventionController.getInterventions);
router.get('/:id', interventionController.getInterventionById);
router.put('/:id', interventionController.updateIntervention);
router.delete('/:id', interventionController.deleteIntervention);

// Routes pour les sous-interventions
router.post('/:interventionId/sousInterventions', sousInterventionController.createSousIntervention);
router.get('/:interventionId/sousInterventions', sousInterventionController.getSousInterventions);
router.put('/sousInterventions/:id', sousInterventionController.updateSousIntervention);
router.delete('/sousInterventions/:id', sousInterventionController.deleteSousIntervention);

module.exports = router;