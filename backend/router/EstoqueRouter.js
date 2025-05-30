const express = require('express');
const router = express.Router();
const controller = require('../controller/EstoqueController');

router.post('/', controller.adicionarEstoque);
router.get('/', controller.listarEstoque);
router.delete('/:codigo', controller.deletarEstoque);

module.exports = router;
