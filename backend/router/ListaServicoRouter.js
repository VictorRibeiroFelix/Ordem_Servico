const express = require('express');
const router = express.Router();
const listaServicoController = require('../controller/ListaServicoController');

console.log("[ServicoRouter] Router carregado");

// Rotas para serviços
router.get("/", listaServicoController.listarServicos);           // GET /api/servico
router.post("/", listaServicoController.criarServico);            // POST /api/servico
router.get("/:id", listaServicoController.buscarServico);    // GET /api/servico/:id
router.put("/:id", listaServicoController.atualizarServico);      // PUT /api/servico/:id
router.delete("/:id", listaServicoController.excluirServico);     // DELETE /api/servico/:id

module.exports = router;