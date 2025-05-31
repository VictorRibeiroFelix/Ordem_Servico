const mongoose = require('mongoose');

const ServicoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  descricao: {
    type: String
  },
  valor: {
    type: Number,
    required: true
  },
  tempo_medio: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Servico', ServicoSchema);
