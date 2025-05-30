const Pedido = require('../model/Pedido');

exports.getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedidos' });
  }
};

exports.createPedido = async (req, res) => {
  try {
    const novoPedido = new Pedido(req.body);
    await novoPedido.save();
    res.status(201).json(novoPedido);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar pedido' });
  }
};

exports.deletePedido = async (req, res) => {
  try {
    await Pedido.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pedido deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar pedido' });
  }
};
