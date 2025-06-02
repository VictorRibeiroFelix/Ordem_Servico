const express = require('express');
const router = express.Router();
const controller = require('../controller/EditarClienteController');

router.get('/:id', controller.getClienteById);
router.put('/:id', controller.updateCliente);

module.exports = router;