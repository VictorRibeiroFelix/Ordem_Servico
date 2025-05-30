const express = require('express');
const router = express.Router();
const pedido = require('../controller/PedidoController');

// Criar nova OS
router.post('/', async (req, res) => {
  try {
    const pedido = new Pedido(req.body);
    await pedido.save();
    res.status(201).json(pedido);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Listar todas as OS
router.get('/', async (req, res) => {
  try {
    const ordens = await Pedido.find();
    res.json(ordens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Deletar OS
router.delete('/:id', async (req, res) => {
  try {
    await Pedido.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ordem excluída com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
