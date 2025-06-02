const Servico = require('../model/ListaServico');

// Buscar por ID
exports.getServicoById = async (req, res) => {
  try {
    console.log(`[EditarServicoController] Buscando serviço ID: ${req.query.id}`);
    const servico = await Servico.findById(req.quey.id);
    if (!servico) {
      console.log(`[EditarServicoController] Serviço não encontrado: ${req.query.id}`);
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }
    console.log(`[EditarServicoController] Serviço encontrado: ${servico.nome}`);
    res.json(servico);
  } catch (error) {
    console.error('[EditarServicoController] Erro ao buscar serviço:', error);
    res.status(500).json({ erro: 'Erro ao buscar serviço', details: error.message });
  }
};

// Atualizar
exports.updateServico = async (req, res) => {
  try {
    console.log(`[EditarServicoController] Atualizando serviço ID: ${req.quey.id}`, req.body);
    const atualizado = await Servico.findByIdAndUpdate(req.quey.id, req.body, { new: true });
    if (!atualizado) {
      console.log(`[EditarServicoController] Serviço não encontrado para atualização: ${req.quey.id}`);
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }
    console.log(`[EditarServicoController] Serviço atualizado: ${atualizado.nome}`);
    res.json(atualizado);
  } catch (error) {
    console.error('[EditarServicoController] Erro ao atualizar serviço:', error);
    res.status(500).json({ erro: 'Erro ao atualizar serviço', details: error.message });
  }
};

exports.deleteServico = async (req, res) => {
  try {
    console.log(`[EditarServicoController] Excluindo serviço ID: ${req.quey.id}`);
    
    const servicoExcluido = await Servico.findByIdAndDelete(req.quey.id);
    
    if (!servicoExcluido) {
      console.log(`[EditarServicoController] Serviço não encontrado para exclusão: ${req.query.id}`);
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }
    
    console.log(`[EditarServicoController] Serviço excluído permanentemente: ${servicoExcluido.nome}`);
    res.json({ 
      message: 'Serviço excluído com sucesso',
      servico: servicoExcluido 
    });
  } catch (error) {
    console.error('[EditarServicoController] Erro ao excluir serviço:', error);
    res.status(500).json({ erro: 'Erro ao excluir serviço', details: error.message });
  }
};