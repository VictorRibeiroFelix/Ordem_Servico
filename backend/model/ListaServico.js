const mongoose = require("mongoose")

const servicoSchema = new mongoose.Schema(
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
    descricao: {
      type: String,
      default: "",
    },
    valor: {
      type: Number,
      required: true,
      min: 0,
    },
    tempo_medio: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  },
)

module.exports = mongoose.model("Servico", servicoSchema)
