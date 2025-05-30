const express = require('express');
const router = express.Router();
const produtoController = require('../controller/CadastroProdutoController');

router.post('/', produtoController.criarProduto);
router.get('/', produtoController.listarProdutos);
router.delete('/:codigo', produtoController.deletarProduto);

module.exports = router;
