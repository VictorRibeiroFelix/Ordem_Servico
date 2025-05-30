const Financeiro = require('../model/Financeiro');

exports.registrarFinanceiro = async (req, res) => {
  try {
    const novoRegistro = new Financeiro(req.body);
    await novoRegistro.save();
    res.status(201).json(novoRegistro);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar os dados financeiros' });
  }
};
