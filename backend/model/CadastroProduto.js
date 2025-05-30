const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  codigo: { type: String },
  categoria: { type: String },
  quantidade: { type: Number, default: 0 },
  preco: { type: Number, default: 0 },
  descricao: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Produto', ProdutoSchema);