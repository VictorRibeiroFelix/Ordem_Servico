const mongoose = require("mongoose")

// Schema para o serviço
const servicoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
  },
  nome: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
  },
  valor: {
    type: Number,
    required: true,
  },
  tempo_medio: {
    type: Number,
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  },
})

// Exporta o schema para ser usado em outros lugares
// NÃO CRIA O MODELO AQUI - apenas exporta o schema
module.exports = {
  servicoSchema,
}
