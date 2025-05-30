const express = require('express');
const router = express.Router();
const reciboController = require('../controller/ReciboController');

router.post('/recibo', reciboController.criarRecibo);
router.get('/recibo', reciboController.listarRecibos);

module.exports = router;
