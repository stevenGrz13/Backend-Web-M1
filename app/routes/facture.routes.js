const express = require('express');
const router = express.Router();
const factureController = require('../controllers/facture.controller');

router.post('/', factureController.createFacture);
router.get('/', factureController.getFactures);
router.put('/:id', factureController.updateFacture);
router.delete('/:id', factureController.deleteFacture);

router.get('/findFactureRupture', factureController.findFactureRupture);

module.exports = router;