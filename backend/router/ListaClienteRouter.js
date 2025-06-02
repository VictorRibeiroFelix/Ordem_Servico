const express = require('express');
const router = express.Router();
const ClienteController = require('../controller/ListaClienteController');

router.get('/', ClienteController.getClientes);
router.post('/', ClienteController.criarCliente);
router.put('/:id', ClienteController.atualizarCliente);
router.delete('/:id', ClienteController.excluirCliente);
router.get('/:id', ClienteController.getClienteById);

module.exports = router;
