const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/services.controller');

router.post('/', serviceController.createService);
router.get('/', serviceController.getServices);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

router.get('/findServiceRupture', serviceController.findServiceRupture);

module.exports = router;