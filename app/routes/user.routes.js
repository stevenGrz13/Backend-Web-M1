// src/components/user/user.routes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../../middleware/auth');

router.post('/', authMiddleware, userController.create);
router.get('/:id', authMiddleware, userController.getById);
router.get('/', authMiddleware, userController.getAll);
router.put('/:id', authMiddleware, userController.update);
router.delete('/:id', authMiddleware, userController.delete);

module.exports = router;
