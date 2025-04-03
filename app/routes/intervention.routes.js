const express = require('express');
const router = express.Router();
const interventionController = require('../controllers/intervention.controller');

// Routes pour les interventions
router.post('/', interventionController.create.bind(interventionController));
router.get('/', interventionController.getAllPaginate.bind(interventionController));
router.get('/mechanics/:mechanicId', interventionController.getAllByMechanic);
// router.get('/mechanics/:mechanicId', interventionController.getAllByMechanic);
router.get('/getFactures', interventionController.getFactures);
router.post('/finirService', interventionController.FinirService);
router.get('/totalRevenueService', interventionController.totalRevenueService);
router.get('/totalRevenueToday', interventionController.totalRevenueToday);
router.get('/statChiffreAffaireByService/:demande', interventionController.statChiffreAffaireByService);
router.get('/getOngoingInterventionForDashboard', interventionController.getOngoingInterventionForDashboard);
router.get('/details/:id', interventionController.getDetails);
router.get('/latest/vehicles/:vehicleId', interventionController.getLatestByVehicleId);
router.get('/latest-five', interventionController.getLatestFive);
router.get('/interventionNumber', interventionController.getNumbersOfInterventions);
router.get('/interventionNumberParEtat', interventionController.findNombreInterventionParEtat);
router.get('/interventionByClientId/:ClientId', interventionController.getInterventionByClientId);
router.get('/interventionEnCours', interventionController.findOngoingInterventions);
router.get('/finalizeIntervention/:interventionId', interventionController.finalizeIntervention);
router.post('/ajouterPiece', interventionController.AjouterPiece);
router.post('/approuverPiece', interventionController.ApprouverPiece);
router.get('/:id', interventionController.getById.bind(interventionController));
router.put('/:id', interventionController.update.bind(interventionController));
router.delete('/:id', interventionController.delete.bind(interventionController));

module.exports = router;
