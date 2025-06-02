const express = require("express")
const router = express.Router()
const cadastroServicoController = require("../controller/CadastroServicoController")

console.log("[CadastroServicoRouter] Router carregado - usando controller real")

// Rotas para serviços
router.post("/", cadastroServicoController.criarServico)
router.get("/", cadastroServicoController.listarServicos)
router.get("/:codigo", cadastroServicoController.buscarServico)
router.put("/:codigo", cadastroServicoController.atualizarServico)
router.delete("/:codigo", cadastroServicoController.excluirServico)

module.exports = router
