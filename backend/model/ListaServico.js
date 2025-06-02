const mongoose = require("mongoose")
const { servicoSchema } = require("./CadastroServico")

// Cria o modelo usando o schema importado
const Servico = mongoose.model("Servico", servicoSchema)

module.exports = Servico
