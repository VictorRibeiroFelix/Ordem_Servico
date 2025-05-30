const mongoose = require('mongoose');

const FinanceiroSchema = new mongoose.Schema({
  nomeCliente: { type: String, required: true },
  servicoPrestado: { type: String, required: true },
  maoDeObra: { type: Number, required: true },
  pecas: { type: Number, required: true },
  valorTotal: { type: Number, required: true },
  statusPagamento: { type: String, enum: ['Pago', 'Pendente'], required: true },
  formaPagamento: { type: String, enum: ['Dinheiro', 'Cartão', 'PIX'], required: true },
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Financeiro', FinanceiroSchema);
