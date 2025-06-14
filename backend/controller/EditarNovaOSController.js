const mongoose = require('mongoose');
const NovaOS = require('../model/NovaOS');
require('../model/Estoque');


exports.getOrdemById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('Recebido ID para busca:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('ID inválido');
      return res.status(400).json({ message: 'ID inválido' });
    }

    const ordem = await NovaOS.findById(id)
      .populate('tipoServico')
      .populate('produtos.produto')
      .populate('tecnicos');

    if (!ordem) {
      console.log('Ordem não encontrada');
      return res.status(404).json({ message: 'Ordem não encontrada' });
    }

    res.json(ordem);
  } catch (error) {
    console.error('❌ ERRO AO BUSCAR ORDEM:', error);
    res.status(500).json({ message: 'Erro ao buscar ordem' });
    console.error(error.stack); 
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
