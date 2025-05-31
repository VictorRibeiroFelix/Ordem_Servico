const express = require("express")
const router = express.Router()
const servicoController = require("../controller/ListaServicoController")

// GET - Listar todos os serviços
router.get("/", servicoController.listarServicos)

// GET - Buscar serviço específico por ID ou código
router.get("/:id", servicoController.buscarServicoPorId)

// POST - Criar novo serviço
router.post("/", servicoController.criarServico)

// PUT - Atualizar serviço
router.put("/:id", servicoController.atualizarServico)

// DELETE - Excluir serviço (soft delete)
router.delete("/:id", servicoController.excluirServico)

module.exports = router
