const express = require('express');
const router = express.Router();
const interventionController = require('../controllers/intervention.controller');

// Routes pour les interventions
router.post('/', interventionController.createIntervention);
router.get('/', interventionController.getInterventions);
router.get('/interventionNumber', interventionController.getNumbersOfInterventions);
router.get('/interventionEnCours', interventionController.findOngoingInterventions);
router.get('/:id', interventionController.getInterventionById);
router.put('/:id', interventionController.updateIntervention);
router.delete('/:id', interventionController.deleteIntervention);

module.exports = router;