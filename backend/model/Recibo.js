const mongoose = require('mongoose');

const reciboSchema = new mongoose.Schema({
  nomeCliente: String,
  servico: String,
  valor: Number,
  formaPagamento: String,
  data: String
});

module.exports = mongoose.model('Recibo', reciboSchema);
