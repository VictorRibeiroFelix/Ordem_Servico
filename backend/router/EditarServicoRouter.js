const express = require('express');
const router = express.Router();
const controller = require('../controller/EditarServicoController');

router.get('/:id', controller.getServicoById);
router.put('/:id', controller.updateServico);
router.delete('/:id', controller.deleteServico); // ← ADICIONE ESTA LINHA

module.exports = router;