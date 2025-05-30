const OrdemServico = require('../model/NovaOS');

exports.criarOrdemServico = async (req, res) => {
  try {
    const novaOrdem = new OrdemServico(req.body);
    await novaOrdem.save();
    res.status(201).json(novaOrdem);
  } catch (error) {
    console.error('Erro ao criar ordem de serviço:', error);
    res.status(500).json({ erro: 'Erro ao criar ordem de serviço' });
  }
};
