// Adicione estes métodos ao seu controller existente

// Buscar cliente por ID
exports.buscarClientePorId = async (req, res) => {
  try {
    console.log(`[ClienteController] Buscando cliente ID: ${req.params.id}`);
    
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      console.log(`[ClienteController] Cliente não encontrado: ${req.params.id}`);
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    console.log(`[ClienteController] Cliente encontrado: ${cliente.nome}`);
    res.json(cliente);
  } catch (error) {
    console.error('[ClienteController] Erro ao buscar cliente:', error);
    res.status(500).json({ message: 'Erro ao buscar cliente', error: error.message });
  }
};

// Atualizar cliente
exports.atualizarCliente = async (req, res) => {
  try {
    console.log(`[ClienteController] Atualizando cliente ID: ${req.params.id}`);
    
    const clienteAtualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!clienteAtualizado) {
      console.log(`[ClienteController] Cliente não encontrado para atualização: ${req.params.id}`);
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    console.log(`[ClienteController] Cliente atualizado: ${clienteAtualizado.nome}`);
    res.json(clienteAtualizado);
  } catch (error) {
    console.error('[ClienteController] Erro ao atualizar cliente:', error);
    res.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
  }
};