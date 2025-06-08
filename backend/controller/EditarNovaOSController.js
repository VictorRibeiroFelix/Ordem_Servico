const NovaOS = require('../model/NovaOS');

exports.getOrdemById = async (req, res) => {
  try {
    const ordem = await NovaOS.findById(req.params.id)
      .populate('tipoServico')
      .populate('produtos.produto')
      .populate('tecnicos');
    
    if (!ordem) {
      return res.status(404).json({ message: 'Ordem não encontrada' });
    }

    res.json(ordem);
  } catch (error) {
    console.error('Erro ao buscar ordem:', error);
    res.status(500).json({ message: 'Erro ao buscar ordem' });
  }
};

exports.updateOrdem = async (req, res) => {
  try {
    const ordemAtualizada = await NovaOS.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ordemAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar ordem:', error);
    res.status(500).json({ message: 'Erro ao atualizar ordem' });
  }
};
