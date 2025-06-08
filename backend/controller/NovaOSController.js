const NovaOS = require('../model/NovaOS');
require('../model/CadastroProduto'); // <--- Isto registra o schema 'Produto'
require('../model/ListaFuncionario');
require('../model/ListaServico');



exports.getOrdemServico = async (req, res) => {
  try {
    const ordem = await NovaOS.findById(req.params.id)
      .populate('tipoServico')
      .populate('produtos.produto')
      .populate('tecnicos');

    if (!ordem) {
      return res.status(404).json({ erro: 'Ordem de serviço não encontrada' });
    }

    res.json(ordem);
  } catch (erro) {
    console.error('Erro ao buscar ordem:', erro);
    res.status(500).json({ erro: 'Erro ao buscar ordem de serviço' });
  }
};