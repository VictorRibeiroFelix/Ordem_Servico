const Funcionario = require('../model/ListaFuncionario');

module.exports = {
  async criar(req, res) {
    try {
      const funcionario = new Funcionario(req.body);
      await funcionario.save();
      res.status(201).json(funcionario);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar técnico', detalhes: error });
    }
  },

  async listar(req, res) {
    try {
      const funcionarios = await Funcionario.find();
      res.json(funcionarios);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar técnicos' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const funcionario = await Funcionario.findById(req.params.id);
      if (!funcionario) {
        return res.status(404).json({ erro: 'Técnico não encontrado' });
      }
      res.json(funcionario);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar técnico' });
    }
  },

  async atualizar(req, res) {
    try {
      const funcionario = await Funcionario.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(funcionario);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar técnico' });
    }
  },

  async excluir(req, res) {
    try {
      await Funcionario.findByIdAndDelete(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao excluir técnico' });
    }
  }
};
