const mongoose = require("mongoose")

const produtoSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
      unique: true,
    },
    nome: {
      type: String,
      required: true,
    },
    categoria: {
      type: String,
      required: true,
    },
    quantidade: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    preco: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    ultimaAtualizacao: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  },
)

module.exports = mongoose.model("Produto", produtoSchema)
