const NovaOSSchema = new mongoose.Schema({
  numeroOS: { type: String, required: true },
  cliente: { type: String, required: true },
  telefone: String,
  email: String,
  endereco: String,
  cep: String,
  estado: String,
  descricao: String,

  tipoServico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servico'
  },

  produtos: [{
    produto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Produto'
    },
    quantidade: { type: Number, default: 1 },
    valor: { type: Number, default: 0 }
  }],

  tecnicos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Funcionario'
  }],

  pecaNecessaria: String,
  valorTotal: { type: Number, default: 0 },
  status: { type: String, default: 'pendente' },
  criadoEm: { type: Date, default: Date.now }
});
