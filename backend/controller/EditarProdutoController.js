const Produto = require('../model/Estoque');

// Buscar produto por código
exports.getProduto = async (req, res) => {
  try {
    // Buscar produto
    const produto = await Produto.findOne({ codigo: req.query.codigo });
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json(produto);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar produto' });
  }
};

// Atualizar produto
exports.updateProduto = async (req, res) => {
  try {
    const produtoAtualizado = await Produto.findOneAndUpdate(
      { codigo: req.params.codigo },
      req.body,
      { new: true }
    );
    res.json(produtoAtualizado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
};
