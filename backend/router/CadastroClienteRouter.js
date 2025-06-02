const express = require('express');
const router = express.Router();
const ClienteController = require('../controller/CadastroClienteController');

router.get('/', ClienteController.getClientes);
router.post('/', ClienteController.criarCliente);
router.put('/:id', ClienteController.atualizarCliente);
router.delete('/:id', ClienteController.excluirCliente);

module.exports = router;
