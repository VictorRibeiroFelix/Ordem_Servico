const Estoque = require('../model/Estoque');

exports.adicionarEstoque = async (req, res) => {
  try {
    const novoProduto = new Estoque(req.body);
    await novoProduto.save();
    res.status(201).json(novoProduto);
  } catch (error) {
    console.error('Erro ao adicionar produto ao estoque:', error);
    res.status(500).json({ erro: 'Erro ao adicionar produto' });
  }
};

exports.listarEstoque = async (req, res) => {
  const estoque = await Estoque.find();
  res.json(estoque);
};

exports.deletarEstoque = async (req, res) => {
  const { codigo } = req.params;
  await Estoque.findOneAndDelete({ codigo });
  res.sendStatus(204);
};

