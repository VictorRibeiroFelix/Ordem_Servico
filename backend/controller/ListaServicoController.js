const Servico = require("../model/ListaServico")
const mongoose = require("mongoose")

// Listar todos os serviços
exports.listarServicos = async (req, res) => {
  try {
    console.log("[ServicoController] Buscando todos os serviços...")

    const filtros = { ativo: true }

    // Se houver parâmetro de busca
    if (req.query.busca) {
      const termoBusca = req.query.busca
      filtros.$or = [
        { nome: { $regex: termoBusca, $options: "i" } },
        { codigo: { $regex: termoBusca, $options: "i" } },
        { descricao: { $regex: termoBusca, $options: "i" } },
      ]
    }

    const servicos = await Servico.find(filtros).sort({ createdAt: -1 })

    console.log(`[ServicoController] Encontrados ${servicos.length} serviços`)
    res.json(servicos)
  } catch (error) {
    console.error("[ServicoController] Erro ao buscar serviços:", error)
    res.status(500).json({ message: "Erro ao buscar serviços", error: error.message })
  }
}

// Buscar serviço específico por ID ou código
exports.buscarServicoPorId = async (req, res) => {
  try {
    const identificador = req.params.id
    console.log(`[ServicoController] Buscando serviço com identificador: ${identificador}`)

    let servico = null

    // Tenta buscar por ObjectId primeiro
    if (mongoose.Types.ObjectId.isValid(identificador)) {
      servico = await Servico.findById(identificador)
    }

    // Se não encontrou, tenta buscar por código
    if (!servico) {
      servico = await Servico.findOne({ codigo: identificador, ativo: true })
    }

    if (!servico) {
      console.log(`[ServicoController] Serviço com identificador ${identificador} não encontrado`)
      return res.status(404).json({ message: "Serviço não encontrado" })
    }

    console.log(`[ServicoController] Serviço encontrado: ${servico.nome}`)
    res.json(servico)
  } catch (error) {
    console.error("[ServicoController] Erro ao buscar serviço:", error)
    res.status(500).json({ message: "Erro ao buscar serviço", error: error.message })
  }
}

// Criar novo serviço
exports.criarServico = async (req, res) => {
  try {
    console.log("[ServicoController] Criando novo serviço:", req.body)

    // Validações básicas
    const { codigo, nome, valor } = req.body

    if (!codigo || !nome) {
      return res.status(400).json({ message: "Código e nome são obrigatórios" })
    }

    // Verifica se já existe serviço com o mesmo código
    const servicoExistente = await Servico.findOne({ codigo: codigo.trim() })
    if (servicoExistente) {
      return res.status(400).json({ message: "Já existe um serviço com este código" })
    }

    // Cria o novo serviço
    const novoServico = new Servico({
      codigo: codigo.trim(),
      nome: nome.trim(),
      descricao: req.body.descricao?.trim() || "",
      valor: valor || 0,
      tempo_medio: req.body.tempo_medio || 0,
    })

    const servicoSalvo = await novoServico.save()

    console.log(`[ServicoController] Serviço criado com sucesso: ${servicoSalvo._id}`)
    res.status(201).json({
      message: "Serviço criado com sucesso",
      servico: servicoSalvo,
    })
  } catch (error) {
    console.error("[ServicoController] Erro ao criar serviço:", error)

    if (error.code === 11000) {
      return res.status(400).json({ message: "Código do serviço já existe" })
    }

    res.status(500).json({ message: "Erro ao criar serviço", error: error.message })
  }
}

// Atualizar serviço
exports.atualizarServico = async (req, res) => {
  try {
    const identificador = req.params.id
    console.log(`[ServicoController] Atualizando serviço ${identificador}:`, req.body)

    // Prepara os dados para atualização
    const dadosAtualizacao = {
      nome: req.body.nome?.trim(),
      descricao: req.body.descricao?.trim() || "",
      valor: req.body.valor || 0,
      tempo_medio: req.body.tempo_medio || 0,
    }

    // Se o código foi alterado, verifica se não existe outro serviço com o mesmo código
    if (req.body.codigo && req.body.codigo.trim()) {
      const servicoComMesmoCodigo = await Servico.findOne({
        codigo: req.body.codigo.trim(),
        _id: { $ne: identificador },
      })

      if (servicoComMesmoCodigo) {
        return res.status(400).json({ message: "Já existe um serviço com este código" })
      }

      dadosAtualizacao.codigo = req.body.codigo.trim()
    }

    let servicoAtualizado = null

    // Tenta atualizar por ObjectId primeiro
    if (mongoose.Types.ObjectId.isValid(identificador)) {
      servicoAtualizado = await Servico.findByIdAndUpdate(identificador, dadosAtualizacao, {
        new: true,
        runValidators: true,
      })
    }

    // Se não encontrou, tenta atualizar por código
    if (!servicoAtualizado) {
      servicoAtualizado = await Servico.findOneAndUpdate({ codigo: identificador }, dadosAtualizacao, {
        new: true,
        runValidators: true,
      })
    }

    if (!servicoAtualizado) {
      return res.status(404).json({ message: "Serviço não encontrado" })
    }

    console.log(`[ServicoController] Serviço atualizado com sucesso: ${servicoAtualizado.nome}`)
    res.json({
      message: "Serviço atualizado com sucesso",
      servico: servicoAtualizado,
    })
  } catch (error) {
    console.error("[ServicoController] Erro ao atualizar serviço:", error)

    if (error.code === 11000) {
      return res.status(400).json({ message: "Código do serviço já existe" })
    }

    res.status(500).json({ message: "Erro ao atualizar serviço", error: error.message })
  }
}

// Excluir serviço (soft delete)
exports.excluirServico = async (req, res) => {
  try {
    const identificador = req.params.id
    console.log(`[ServicoController] Excluindo serviço com identificador: ${identificador}`)

    let servicoExcluido = null

    // Tenta excluir por ObjectId primeiro
    if (mongoose.Types.ObjectId.isValid(identificador)) {
      servicoExcluido = await Servico.findByIdAndUpdate(identificador, { ativo: false }, { new: true })
    }

    // Se não encontrou, tenta excluir por código
    if (!servicoExcluido) {
      servicoExcluido = await Servico.findOneAndUpdate({ codigo: identificador }, { ativo: false }, { new: true })
    }

    if (!servicoExcluido) {
      return res.status(404).json({ message: "Serviço não encontrado" })
    }

    console.log(`[ServicoController] Serviço excluído com sucesso: ${servicoExcluido.nome}`)
    res.json({ message: "Serviço excluído com sucesso" })
  } catch (error) {
    console.error("[ServicoController] Erro ao excluir serviço:", error)
    res.status(500).json({ message: "Erro ao excluir serviço", error: error.message })
  }
}
