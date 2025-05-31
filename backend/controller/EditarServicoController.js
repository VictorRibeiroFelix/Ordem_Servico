const Servico = require('../model/ListaServico');

// Buscar por ID
exports.getServicoById = async (req, res) => {
  try {
    const servico = await Servico.findById(req.params.id);
    if (!servico) return res.status(404).json({ erro: 'Serviço não encontrado' });
    res.json(servico);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar serviço' });
  }
};

// Atualizar
exports.updateServico = async (req, res) => {
  try {
    const atualizado = await Servico.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!atualizado) return res.status(404).json({ erro: 'Serviço não encontrado' });
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar serviço' });
  }
};
