const express = require('express');
const router = express.Router();
const ServicoController = require('../controller/ListaServicoController');

router.get('/', ServicoController.listarServicos);
router.post('/', ServicoController.criarServico);
router.put('/:id', ServicoController.atualizarServico);
router.delete('/:id', ServicoController.excluirServico);

module.exports = router;
