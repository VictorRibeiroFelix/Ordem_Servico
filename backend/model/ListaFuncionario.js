const mongoose = require('mongoose');

const FuncionarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String },
  telefone: { type: String },
  cpf: { type: String },
  funcao: { type: String },
  endereco: { type: String },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Funcionario', FuncionarioSchema);
