const express = require('express');
const router = express.Router();
const pieceController = require('../controllers/piece.controller');

router.post('/', pieceController.create.bind(pieceController));
router.get('/', pieceController.getAllPaginate.bind(pieceController));
router.put('/:id', pieceController.update.bind(pieceController));
router.delete('/:id', pieceController.delete.bind(pieceController));

router.get('/findPieceRupture', pieceController.findPieceRupture);

module.exports = router;
