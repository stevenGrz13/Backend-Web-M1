const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');

router.post('/', roleController.create.bind(roleController));
router.get('/', roleController.getAllPaginate.bind(roleController));
router.get('/:nom', roleController.getRole.bind(roleController));
router.get('/:id', roleController.getById.bind(roleController));
router.put('/:id', roleController.update.bind(roleController));
router.delete('/:id', roleController.delete.bind(roleController));

module.exports = router;