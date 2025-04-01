const express = require('express');
const router = express.Router();
const factureController = require('../controllers/facture.controller');

router.get('/clients/:clientId', factureController.getFactureByClientId);
router.get('/PayerFacture/:factureId', factureController.payerFacture);
router.get('/getFactureByClientId/:clientId', factureController.getFactureByClientId);
router.post('/', factureController.create.bind(factureController));
router.get('/', factureController.getAllPaginate.bind(factureController));
router.put('/:id', factureController.update.bind(factureController));
router.delete('/:id', factureController.delete.bind(factureController));

module.exports = router;
