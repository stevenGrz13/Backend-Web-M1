// src/components/vehicle/routes/vehicle.routes.js

const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const authMiddleware = require('../../middleware/auth');

router.post('/', vehicleController.create);
router.get('/:id', vehicleController.getById);
router.get('/', vehicleController.getAllVehicle);
router.get('/client/:clientId', vehicleController.getByClientId);
router.put('/:id', vehicleController.update);
router.delete('/:id', vehicleController.delete);

// router.post('/', authMiddleware, vehicleController.create);
// router.get('/:id', authMiddleware, vehicleController.getById);
// router.get('/client/:clientId', authMiddleware, vehicleController.getByClientId);
// router.put('/:id', authMiddleware, vehicleController.update);
// router.delete('/:id', authMiddleware, vehicleController.delete);

module.exports = router;
