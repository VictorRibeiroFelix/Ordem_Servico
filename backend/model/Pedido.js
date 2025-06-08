const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
  numeroOS: { type: String, required: true },
  cliente: { type: String, required: true },
  equipamento: { type: String, required: true },
  defeito: { type: String },
  status: { type: String, enum: ['pendente', 'em andamento', 'concluído'], default: 'pendente' },
  dataEntrada: { type: Date, default: Date.now },
  dataSaida: { type: Date },
  valor: { type: Number },
  formaPagamento: { type: String },
  pago: { type: Boolean, default: false }
});

module.exports = mongoose.model('Pedido', PedidoSchema);

