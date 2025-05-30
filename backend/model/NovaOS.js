const mongoose = require('mongoose');

const NovaOSSchema = new mongoose.Schema({
  cliente: String,
  telefone: String,
  email: String,
  endereco: String,
  cep: String,
  estado: String,
  descricao: String,
  tipoServico: String,
  pecaNecessaria: String,
  tecnico: String,
  status: { type: String, default: 'pendente' },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NovaOS', NovaOSSchema);
