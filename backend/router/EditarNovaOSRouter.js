const express = require('express');
const router = express.Router();
const controller = require('../controller/EditarNovaOSController');

router.get('/:id', controller.getOrdemServico);
router.put('/:id', controller.atualizarOrdemServico);

module.exports = router;
