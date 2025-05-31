const express = require('express');
const router = express.Router();
const controller = require('../controller/EditarServicoController');

router.get('/:id', controller.getServicoById);
router.put('/:id', controller.updateServico);

module.exports = router;
