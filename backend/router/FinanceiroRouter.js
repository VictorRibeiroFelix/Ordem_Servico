const express = require('express');
const router = express.Router();
const financeiroController = require('../controller/FinanceiroController');

router.post('/', financeiroController.registrarFinanceiro);

module.exports = router;
