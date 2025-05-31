const Servico = require('../model/ListaServico');

// Criar novo serviço
exports.criarServico = async (req, res) => {
  try {
    const novoServico = new Servico(req.body);
    await novoServico.save();
    res.status(201).json(novoServico);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar serviço', detalhes: err.message });
  }
};

// Listar todos os serviços
exports.listarServicos = async (req, res) => {
  try {
    const servicos = await Servico.find();
    res.json(servicos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar serviços' });
  }
};

// Atualizar serviço
exports.atualizarServico = async (req, res) => {
  try {
    const servicoAtualizado = await Servico.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!servicoAtualizado) {
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }
    res.json(servicoAtualizado);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar serviço', detalhes: err.message });
  }
};

// Deletar serviço
exports.deletarServico = async (req, res) => {
  try {
    const deletado = await Servico.findByIdAndDelete(req.params.id);
    if (!deletado) {
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }
    res.json({ mensagem: 'Serviço deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar serviço' });
  }
};
