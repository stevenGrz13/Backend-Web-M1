const express = require('express');
const router = express.Router();
const interventionController = require('../controllers/intervention.controller');

// Routes pour les interventions
router.post('/', interventionController.create.bind(interventionController));
router.get('/', interventionController.getAllPaginate.bind(interventionController));
router.get('/interventionNumber', interventionController.getNumbersOfInterventions);
router.get('/interventionByClientId/:ClientId', interventionController.getInterventionByClientId);
router.get('/interventionEnCours', interventionController.findOngoingInterventions);
router.get('/finalizeIntervention/:interventionId', interventionController.finalizeIntervention);
router.get('/:id', interventionController.getById.bind(interventionController));
router.put('/:id', interventionController.update.bind(interventionController));
router.delete('/:id', interventionController.delete.bind(interventionController));

module.exports = router;