const Cliente = require('../model/ListaCliente');

exports.getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar clientes' });
  }
};

exports.getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar cliente' });
  }
};

exports.criarCliente = async (req, res) => {
  try {
    const novoCliente = new Cliente(req.body);
    await novoCliente.save();
    res.status(201).json(novoCliente);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar cliente' });
  }
};

exports.atualizarCliente = async (req, res) => {
  try {
    const clienteAtualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(clienteAtualizado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar cliente' });
  }
};

exports.excluirCliente = async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Cliente excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir cliente' });
  }
};
