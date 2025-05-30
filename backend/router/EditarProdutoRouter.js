const express = require('express');
const router = express.Router();
const controller = require('../controller/EditarProdutoController'); // Verifique esse caminho!

router.get('/:codigo', controller.getProduto);
router.put('/:codigo', controller.updateProduto);

module.exports = router;
