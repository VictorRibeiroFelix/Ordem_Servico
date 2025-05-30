const mongoose = require('mongoose');

const EstoqueSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  codigo: { type: String, required: true }, // Número da peça
  categoria: { type: String },
  quantidade: { type: Number, default: 0 }, // Estoque atual
  preco: { type: Number },
  descricao: { type: String },
  ultimaAtualizacao: { type: Date, default: Date.now } // Última atualização
});

module.exports = mongoose.model('Estoque', EstoqueSchema);

