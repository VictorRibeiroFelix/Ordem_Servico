const NovaOS = require('../model/NovaOS');

exports.atualizarOrdemServico = async (req, res) => {
  try {
    const ordemAtualizada = await OrdemServico.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!ordemAtualizada) {
      return res.status(404).json({ erro: 'Ordem de serviço não encontrada' });
    }
    res.json(ordemAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar ordem:', error);
    res.status(500).json({ erro: 'Erro ao atualizar ordem de serviço' });
  }
};

// Buscar uma ordem específica por ID (para pré-preencher ao editar)
exports.getOrdemServico = async (req, res) => {
  try {
    const ordem = await OrdemServico.findById(req.params.id);
    if (!ordem) {
      return res.status(404).json({ erro: 'Ordem não encontrada' });
    }
    res.json(ordem);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar ordem de serviço' });
  }
};

