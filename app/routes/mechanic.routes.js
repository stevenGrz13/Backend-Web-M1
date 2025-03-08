// src/components/mechanic/routes/mechanic.routes.js
const express = require('express');
const router = express.Router();
const mechanicController = require('../controllers/mechanic.controller');
const authMiddleware = require('../../middleware/auth');

router.post('/', authMiddleware, mechanicController.create);
router.get('/:id', authMiddleware, mechanicController.getById);
router.get('/', authMiddleware, mechanicController.getAll);
router.put('/:id', authMiddleware, mechanicController.update);
router.delete('/:id', authMiddleware, mechanicController.delete);

module.exports = router;
