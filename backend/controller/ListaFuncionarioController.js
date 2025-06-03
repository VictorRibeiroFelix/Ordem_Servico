const Funcionario = require('../model/ListaFuncionario');

exports.getFuncionarios = async (req, res) => {
  try {
    const funcionarios = await Funcionario.find();
    res.json(funcionarios);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar funcionários' });
  }
};

exports.getFuncionarioById = async (req, res) => {
  try {
    const funcionario = await Funcionario.findById(req.params.id);
    if (!funcionario) return res.status(404).json({ erro: 'Funcionário não encontrado' });
    res.json(funcionario);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar funcionário' });
  }
};

exports.criarFuncionario = async (req, res) => {
  try {
    const novo = new Funcionario(req.body);
    await novo.save();
    res.status(201).json(novo);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao cadastrar funcionário' });
  }
};

exports.atualizarFuncionario = async (req, res) => {
  try {
    const atualizado = await Funcionario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar funcionário' });
  }
};

exports.excluirFuncionario = async (req, res) => {
  try {
    await Funcionario.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Funcionário excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir funcionário' });
  }
};
