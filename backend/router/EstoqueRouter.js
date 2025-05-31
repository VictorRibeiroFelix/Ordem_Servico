const express = require("express")
const router = express.Router()
const estoqueController = require("../controller/EstoqueController")

// GET - Listar todos os produtos
router.get("/", estoqueController.listarProdutos)

// GET - Buscar produto específico pelo código
router.get("/:codigo", estoqueController.buscarProdutoPorCodigo)

// DELETE - Excluir produto
router.delete("/:codigo", estoqueController.excluirProduto)

module.exports = router
