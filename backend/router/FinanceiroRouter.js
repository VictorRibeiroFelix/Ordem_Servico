const express = require('express');
const router = express.Router();
const financeiroController = require('../controller/FinanceiroController');

router.post('/', financeiroController.registrarFinanceiro);

// ✅ NOVA ROTA
router.get('/:id', financeiroController.buscarFinanceiroPorId);

module.exports = router;
