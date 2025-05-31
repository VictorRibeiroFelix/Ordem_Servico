const Produto = require('../model/Estoque');

exports.criarProduto = async (req, res) => {
  try {
    const novoProduto = new Produto(req.body);
    await novoProduto.save();
    res.status(201).json(novoProduto);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

exports.listarProduto = async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

exports.deletarProduto = async (req, res) => {
  try {
    const { codigo } = req.params;
    await Produto.findByIdAndDelete(codigo);
    res.status(200).json({ mensagem: 'Produto excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir o produto' });
  }
};
