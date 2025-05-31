// controller/NovaOSController.js
const Pedido = require('../model/Pedido');

exports.criarOrdemServico = async (req, res) => {
  try {
    const novoPedido = new Pedido(req.body);
    await novoPedido.save();
    res.status(201).json(novoPedido);
  } catch (error) {
    console.error('Erro ao criar ordem de serviço:', error);
    res.status(500).json({ erro: 'Erro ao criar ordem de serviço' });
  }
};
