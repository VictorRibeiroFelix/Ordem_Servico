const express = require('express');
const router = express.Router();
const controller = require('../controller/NovaOSController'); // IMPORT CORRETO

router.post('/', controller.criarOrdemServico); // FUNÇÃO TEM QUE EXISTIR

module.exports = router;
