const express = require('express');
const router = express.Router();
const controller = require('../controller/EditarNovaOSController');

// Corrigir as rotas abaixo

// Buscar ordem por ID
router.get('/:id', controller.getOrdemById);

// Atualizar ordem
router.put('/:id', controller.updateOrdem);

module.exports = router;
