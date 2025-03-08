const express = require('express');
const router = express.Router();
const managerController = require('../controllers/manager.controller');
const authMiddleware = require("../../middleware/auth");

router.post('/', authMiddleware, managerController.create);
router.get('/', authMiddleware, managerController.getById);
router.put('/:id', authMiddleware, managerController.update);
router.delete('/:id', authMiddleware, managerController.delete);

module.exports = router;
