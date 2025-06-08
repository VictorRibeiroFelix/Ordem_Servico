const mongoose = require('mongoose');

const FinanceiroSchema = new mongoose.Schema({
  nomeCliente: { type: String, required: [true, 'Nome do cliente é obrigatório'] },
  servicoPrestado: { type: String, default: 'Serviço técnico' },
  maoDeObra: { type: Number, default: 0, min: 0 },
  pecas: { type: Number, default: 0, min: 0 },
  valorTotal: { 
    type: Number, 
    required: [true, 'Valor total é obrigatório'],
    min: 0
  },
  statusPagamento: { 
    type: String, 
    enum: ['Pago', 'Pendente'], 
    default: 'Pago' 
  },
  formaPagamento: { 
    type: String, 
    enum: ['Dinheiro', 'Cartão', 'PIX'],
    required: [true, 'Forma de pagamento é obrigatória']
  },
  data: { type: Date, default: Date.now }
}, {
  versionKey: false // Remove o campo __v
});

module.exports = mongoose.model('Financeiro', FinanceiroSchema);