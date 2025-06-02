const express = require('express');
const router = express.Router();

// Importe o modelo diretamente (ajuste o caminho conforme necessário)
const Cliente = require('../model/ListaCliente'); // ou o caminho correto para seu modelo

console.log('[CadastroClienteRouter] Router carregado');

// GET /api/cliente - Listar todos os clientes
router.get('/', async (req, res) => {
  try {
    console.log('[CadastroClienteRouter] Listando todos os clientes');
    const clientes = await Cliente.find();
    console.log(`[CadastroClienteRouter] Encontrados ${clientes.length} clientes`);
    res.json(clientes);
  } catch (error) {
    console.error('[CadastroClienteRouter] Erro ao listar clientes:', error);
    res.status(500).json({ message: 'Erro ao listar clientes', error: error.message });
  }
});

// GET /api/cliente/:id - Buscar cliente por ID
router.get('/:id', async (req, res) => {
  try {
    console.log(`[CadastroClienteRouter] Buscando cliente ID: ${req.params.id}`);
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      console.log(`[CadastroClienteRouter] Cliente não encontrado: ${req.params.id}`);
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    console.log(`[CadastroClienteRouter] Cliente encontrado: ${cliente.nome}`);
    res.json(cliente);
  } catch (error) {
    console.error('[CadastroClienteRouter] Erro ao buscar cliente:', error);
    res.status(500).json({ message: 'Erro ao buscar cliente', error: error.message });
  }
});

// POST /api/cliente - Criar novo cliente
router.post('/', async (req, res) => {
  try {
    console.log('[CadastroClienteRouter] Criando novo cliente:', req.body);
    const novoCliente = new Cliente(req.body);
    const clienteSalvo = await novoCliente.save();
    console.log(`[CadastroClienteRouter] Cliente criado: ${clienteSalvo.nome}`);
    res.status(201).json(clienteSalvo);
  } catch (error) {
    console.error('[CadastroClienteRouter] Erro ao criar cliente:', error);
    res.status(500).json({ message: 'Erro ao criar cliente', error: error.message });
  }
});

// PUT /api/cliente/:id - Atualizar cliente
router.put('/:id', async (req, res) => {
  try {
    console.log(`[CadastroClienteRouter] Atualizando cliente ID: ${req.params.id}`);
    const clienteAtualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!clienteAtualizado) {
      console.log(`[CadastroClienteRouter] Cliente não encontrado para atualização: ${req.params.id}`);
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    console.log(`[CadastroClienteRouter] Cliente atualizado: ${clienteAtualizado.nome}`);
    res.json(clienteAtualizado);
  } catch (error) {
    console.error('[CadastroClienteRouter] Erro ao atualizar cliente:', error);
    res.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
  }
});

// DELETE /api/cliente/:id - Excluir cliente
router.delete('/:id', async (req, res) => {
  try {
    console.log(`[CadastroClienteRouter] Excluindo cliente ID: ${req.params.id}`);
    const clienteExcluido = await Cliente.findByIdAndDelete(req.params.id);
    
    if (!clienteExcluido) {
      console.log(`[CadastroClienteRouter] Cliente não encontrado para exclusão: ${req.params.id}`);
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    console.log(`[CadastroClienteRouter] Cliente excluído: ${clienteExcluido.nome}`);
    res.json({ message: 'Cliente excluído com sucesso' });
  } catch (error) {
    console.error('[CadastroClienteRouter] Erro ao excluir cliente:', error);
    res.status(500).json({ message: 'Erro ao excluir cliente', error: error.message });
  }
});

module.exports = router;