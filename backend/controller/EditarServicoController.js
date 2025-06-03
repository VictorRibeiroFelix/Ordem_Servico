const Servico = require('../model/ListaServico');

// Buscar por ID
exports.getServicoById = async (req, res) => {
  try {
    // Debug: verificar se req.params existe
    console.log('[EditarServicoController] req.params:', req.params);
    console.log('[EditarServicoController] req.url:', req.url);
    console.log('[EditarServicoController] req.method:', req.method);
    
    // Verificar se req.params existe
    if (!req.params) {
      console.error('[EditarServicoController] req.params é undefined');
      return res.status(400).json({ erro: 'Parâmetros da requisição não encontrados' });
    }
    
    // Verificar se o ID existe
    if (!req.params.id) {
      console.error('[EditarServicoController] ID não fornecido');
      return res.status(400).json({ erro: 'ID do serviço não fornecido' });
    }
    
    const servicoId = req.params.id;
    console.log(`[EditarServicoController] Buscando serviço ID: ${servicoId}`);
    
    const servico = await Servico.findById(servicoId);
    
    if (!servico) {
      console.log(`[EditarServicoController] Serviço não encontrado: ${servicoId}`);
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
    // Debug: verificar se req.params existe
    console.log('[EditarServicoController] UPDATE - req.params:', req.params);
    
    if (!req.params || !req.params.id) {
      console.error('[EditarServicoController] ID não fornecido para atualização');
      return res.status(400).json({ erro: 'ID do serviço não fornecido' });
    }
    
    const servicoId = req.params.id;
    console.log(`[EditarServicoController] Atualizando serviço ID: ${servicoId}`, req.body);
    
    const atualizado = await Servico.findByIdAndUpdate(servicoId, req.body, { new: true });
    
    if (!atualizado) {
      console.log(`[EditarServicoController] Serviço não encontrado para atualização: ${servicoId}`);
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }
    
    console.log(`[EditarServicoController] Serviço atualizado: ${atualizado.nome}`);
    res.json(atualizado);
  } catch (error) {
    console.error('[EditarServicoController] Erro ao atualizar serviço:', error);
    res.status(500).json({ erro: 'Erro ao atualizar serviço', details: error.message });
  }
};

// Excluir serviço
exports.deleteServico = async (req, res) => {
  try {
    // Debug: verificar se req.params existe
    console.log('[EditarServicoController] DELETE - req.params:', req.params);
    
    if (!req.params || !req.params.id) {
      console.error('[EditarServicoController] ID não fornecido para exclusão');
      return res.status(400).json({ erro: 'ID do serviço não fornecido' });
    }
    
    const servicoId = req.params.id;
    console.log(`[EditarServicoController] Excluindo serviço ID: ${servicoId}`);
    
    // Soft delete (recomendado) - marca como inativo
    const servicoAtualizado = await Servico.findByIdAndUpdate(
      servicoId, 
      { ativo: false }, 
      { new: true }
    );
    
    if (!servicoAtualizado) {
      console.log(`[EditarServicoController] Serviço não encontrado para exclusão: ${servicoId}`);
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }
    
    console.log(`[EditarServicoController] Serviço excluído com sucesso: ${servicoAtualizado.nome}`);
    res.json({ 
      message: 'Serviço excluído com sucesso',
      servico: servicoAtualizado 
    });
  } catch (error) {
    console.error('[EditarServicoController] Erro ao excluir serviço:', error);
    res.status(500).json({ erro: 'Erro ao excluir serviço', details: error.message });
  }
};