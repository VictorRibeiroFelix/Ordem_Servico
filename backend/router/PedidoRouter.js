const express = require("express")
const router = express.Router()
const mongoose = require("mongoose") // Import mongoose

console.log("[PedidoRouter] Carregando router...")

// Tentar carregar o modelo
let Pedido
try {
  Pedido = require("../model/Pedido")
  console.log("[PedidoRouter] Modelo Pedido carregado")
} catch (error) {
  console.log("[PedidoRouter] Modelo Pedido não encontrado, tentando NovaOS...")
  try {
    Pedido = require("../model/NovaOS")
    console.log("[PedidoRouter] Modelo NovaOS carregado como Pedido")
  } catch (error2) {
    console.error("[PedidoRouter] Nenhum modelo encontrado:", error2)
  }
}

// Middleware para logs
router.use((req, res, next) => {
  console.log(`[PedidoRouter] ${req.method} ${req.url}`)
  next()
})

// GET /api/pedido - Listar todos os pedidos
router.get("/", async (req, res) => {
  try {
    console.log("[PedidoRouter] Listando pedidos...")

    if (!Pedido) {
      return res.status(500).json({ erro: "Modelo não carregado" })
    }

    const pedidos = await Pedido.find().sort({ criadoEm: -1 })
    console.log(`[PedidoRouter] Encontrados ${pedidos.length} pedidos`)

    // Debug: verificar se numeroOS está sendo retornado
    if (pedidos.length > 0) {
      console.log("[PedidoRouter] Exemplo de pedido retornado:", {
        _id: pedidos[0]._id,
        numeroOS: pedidos[0].numeroOS,
        cliente: pedidos[0].cliente,
      })
    }

    res.json(pedidos)
  } catch (error) {
    console.error("[PedidoRouter] Erro ao listar pedidos:", error)
    res.status(500).json({
      erro: "Erro ao listar pedidos",
      detalhes: error.message,
    })
  }
})

// GET /api/pedido/:id - Buscar pedido por ID
router.get("/:id", async (req, res) => {
  try {
    console.log(`[PedidoRouter] Buscando pedido ID: ${req.params.id}`)

    if (!Pedido) {
      return res.status(500).json({ erro: "Modelo não carregado" })
    }

    const pedido = await Pedido.findById(req.params.id)

    if (!pedido) {
      return res.status(404).json({ erro: "Pedido não encontrado" })
    }

    console.log(`[PedidoRouter] Pedido encontrado - numeroOS: ${pedido.numeroOS}`)
    res.json(pedido)
  } catch (error) {
    console.error("[PedidoRouter] Erro ao buscar pedido:", error)
    res.status(500).json({ erro: "Erro ao buscar pedido" })
  }
})

// POST /api/pedido - Criar novo pedido
router.post("/", async (req, res) => {
  try {
    console.log("[PedidoRouter] Criando novo pedido...")
    console.log("[PedidoRouter] numeroOS recebido:", req.body.numeroOS)

    if (!Pedido) {
      return res.status(500).json({ erro: "Modelo não carregado" })
    }

    // Verificar se numeroOS foi enviado
    if (!req.body.numeroOS) {
      console.error("[PedidoRouter] ERRO: numeroOS não foi enviado!")
      return res.status(400).json({ erro: "numeroOS é obrigatório" })
    }

    // Adicionar campo equipamento se não existir
    const dados = {
      ...req.body,
      numeroOS: req.body.numeroOS, // Garantir que numeroOS seja salvo
      equipamento: req.body.equipamento || req.body.descricao || "Não informado",
    }

    console.log("[PedidoRouter] Dados a serem salvos:", {
      numeroOS: dados.numeroOS,
      cliente: dados.cliente,
      valorTotal: dados.valorTotal,
    })

    const novoPedido = new Pedido(dados)
    const pedidoSalvo = await novoPedido.save()

    console.log(`[PedidoRouter] ✅ Pedido criado com sucesso!`)
    console.log(`[PedidoRouter] ID: ${pedidoSalvo._id}`)
    console.log(`[PedidoRouter] numeroOS salvo: ${pedidoSalvo.numeroOS}`)

    res.status(201).json(pedidoSalvo)
  } catch (error) {
    console.error("[PedidoRouter] Erro ao criar pedido:", error)
    res.status(500).json({
      erro: "Erro ao criar pedido",
      detalhes: error.message,
    })
  }
})

// DELETE /api/pedido/:id - Excluir pedido
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id
    console.log(`[PedidoRouter] Excluindo pedido ID: ${id}`)

    if (!Pedido) {
      console.error("[PedidoRouter] Modelo não carregado")
      return res.status(500).json({ erro: "Modelo não carregado" })
    }

    // Verificar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("[PedidoRouter] ID inválido:", id)
      return res.status(400).json({ erro: "ID inválido" })
    }

    console.log(`[PedidoRouter] Tentando excluir pedido com ID: ${id}`)
    const pedidoExcluido = await Pedido.findByIdAndDelete(id)

    if (!pedidoExcluido) {
      console.log(`[PedidoRouter] Pedido não encontrado com ID: ${id}`)
      return res.status(404).json({ erro: "Pedido não encontrado" })
    }

    console.log(`[PedidoRouter] Pedido excluído com sucesso: ${pedidoExcluido._id}`)
    res.json({ message: "Pedido excluído com sucesso" })
  } catch (error) {
    console.error("[PedidoRouter] Erro ao excluir pedido:", error)
    res.status(500).json({
      erro: "Erro ao excluir pedido",
      detalhes: error.message,
    })
  }
})

// PUT /api/pedido/:id - Atualizar pedido
router.put("/:id", async (req, res) => {
  try {
    console.log(`[PedidoRouter] Atualizando pedido ID: ${req.params.id}`)
    console.log("[PedidoRouter] numeroOS nos dados:", req.body.numeroOS)

    if (!Pedido) {
      return res.status(500).json({ erro: "Modelo não carregado" })
    }

    const pedidoAtualizado = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true })

    if (!pedidoAtualizado) {
      return res.status(404).json({ erro: "Pedido não encontrado" })
    }

    console.log(`[PedidoRouter] Pedido atualizado: ${pedidoAtualizado._id}`)
    console.log(`[PedidoRouter] numeroOS após atualização: ${pedidoAtualizado.numeroOS}`)
    res.json(pedidoAtualizado)
  } catch (error) {
    console.error("[PedidoRouter] Erro ao atualizar pedido:", error)
    res.status(500).json({ erro: "Erro ao atualizar pedido" })
  }
})

console.log("[PedidoRouter] Router configurado")
module.exports = router
