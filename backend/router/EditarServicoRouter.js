const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Importar o modelo diretamente
const Servico = require('../model/ListaServico');

console.log('[EditarServicoRouter] Router carregado');

// Middleware para log de todas as requisições
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

// GET /:id - Buscar serviço por ID
router.get('/:id', async (req, res) => {
  try {
    const servicoId = req.params.id;
    console.log(`[EditarServicoRouter] Buscando serviço ID: ${servicoId}`);
    
    const servico = await Servico.findById(servicoId);
    
    if (!servico) {
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }
    
    console.log(`[EditarServicoRouter] Serviço encontrado: ${servico.nome}`);
    res.json(servico);
  } catch (error) {
    console.error('[EditarServicoRouter] Erro ao buscar serviço:', error);
    res.status(500).json({ erro: 'Erro ao buscar serviço', details: error.message });
  }
});

// PUT /:id - Atualizar serviço
router.put('/:id', async (req, res) => {
  try {
    const servicoId = req.params.id;
    console.log(`[EditarServicoRouter] Atualizando serviço ID: ${servicoId}`);
    console.log(`[EditarServicoRouter] Dados:`, req.body);
    
    // Remover campos que podem causar problemas
    const dadosAtualizacao = { ...req.body };
    delete dadosAtualizacao._id; // Remover _id para evitar erros
    
    const atualizado = await Servico.findByIdAndUpdate(
      servicoId, 
      dadosAtualizacao, 
      { new: true }
    );
    
    if (!atualizado) {
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }
    
    console.log(`[EditarServicoRouter] Serviço atualizado: ${atualizado.nome}`);
    res.json(atualizado);
  } catch (error) {
    console.error('[EditarServicoRouter] Erro ao atualizar serviço:', error);
    res.status(500).json({ erro: 'Erro ao atualizar serviço', details: error.message });
  }
});

// DELETE /:id - Excluir serviço
router.delete('/:id', async (req, res) => {
  try {
    const servicoId = req.params.id;
    console.log(`[EditarServicoRouter] Excluindo serviço ID: ${servicoId}`);
    
    // Soft delete
    const servicoAtualizado = await Servico.findByIdAndUpdate(
      servicoId, 
      { ativo: false }, 
      { new: true }
    );
    
    if (!servicoAtualizado) {
      return res.status(404).json({ erro: 'Serviço não encontrado' });
    }
    
    console.log(`[EditarServicoRouter] Serviço excluído: ${servicoAtualizado.nome}`);
    res.json({ message: 'Serviço excluído com sucesso' });
  } catch (error) {
    console.error('[EditarServicoRouter] Erro ao excluir serviço:', error);
    res.status(500).json({ erro: 'Erro ao excluir serviço', details: error.message });
  }
});

module.exports = router;