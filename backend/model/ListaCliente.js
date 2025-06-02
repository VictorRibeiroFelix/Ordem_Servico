const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: { type: String },
  email: { type: String },
  endereco: { type: String },
  cidade: { type: String },
  uf: { type: String },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cliente', ClienteSchema);
