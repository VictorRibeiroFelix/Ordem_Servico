const Recibo = require('../model/Recibo');

exports.criarRecibo = async (req, res) => {
  try {
    const novoRecibo = new Recibo(req.body);
    await novoRecibo.save();
    res.status(201).json(novoRecibo);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar recibo', detalhes: error.message });
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
