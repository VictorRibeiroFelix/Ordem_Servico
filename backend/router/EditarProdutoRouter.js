const express = require("express")
const router = express.Router()
const editarProdutoController = require("../controller/EditarProdutoController")

// GET - Buscar produto específico pelo código
router.get("/:codigo", editarProdutoController.buscarProdutoPorCodigo)

// PUT - Atualizar produto
router.put("/:codigo", editarProdutoController.atualizarProduto)

module.exports = router
