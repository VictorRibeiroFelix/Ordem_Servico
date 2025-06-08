const Recibo = require('../model/Recibo');

exports.criarRecibo = async (req, res) => {
  try {
    // Busca os dados financeiros primeiro
    const financeiro = await Financeiro.findById(req.body.financeiroId);
    if (!financeiro) {
      return res.status(404).json({ error: 'Dados financeiros não encontrados' });
    }

    // Cria o recibo com os dados do financeiro
    const novoRecibo = new Recibo({
      nomeCliente: financeiro.nomeCliente,
      servico: financeiro.servicoPrestado,
      valor: financeiro.valorTotal,
      formaPagamento: financeiro.formaPagamento,
      data: new Date().toISOString()
    });

    await novoRecibo.save();
    res.status(201).json(novoRecibo);
  } catch (error) {
    res.status(500).json({ 
      error: 'Erro ao criar recibo',
      details: error.message 
    });
  }
};

exports.listarRecibos = async (req, res) => {
  try {
    const recibos = await Recibo.find();
    res.status(200).json(recibos);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar recibos' });
  }
};
