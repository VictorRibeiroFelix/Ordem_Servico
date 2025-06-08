const express = require("express")
const router = express.Router()

// Adicionar importação do mongoose no topo do arquivo
const mongoose = require("mongoose")

console.log("[NovaOSRouter] Carregando router...")

// Tentar carregar o modelo
let NovaOS
try {
  NovaOS = require("../model/NovaOS")
  console.log("[NovaOSRouter] Modelo NovaOS carregado")
} catch (error) {
  console.log("[NovaOSRouter] Modelo NovaOS não encontrado, tentando Pedido...")
  try {
    NovaOS = require("../model/Pedido")
    console.log("[NovaOSRouter] Modelo Pedido carregado como NovaOS")
  } catch (error2) {
    console.error("[NovaOSRouter] Nenhum modelo encontrado:", error2)
  }
}

// Middleware para logs
router.use((req, res, next) => {
  console.log(`[NovaOSRouter] ${req.method} ${req.url}`)
  next()
})

// GET /api/novaos - Listar todas as ordens
router.get("/", async (req, res) => {
  try {
    console.log("[NovaOSRouter] Listando ordens...")

    if (!NovaOS) {
      return res.status(500).json({ erro: "Modelo não carregado" })
    }

    const ordens = await NovaOS.find().sort({ criadoEm: -1 })
    console.log(`[NovaOSRouter] Encontradas ${ordens.length} ordens`)

    // Debug: verificar se numeroOS está sendo retornado
    if (ordens.length > 0) {
      console.log("[NovaOSRouter] Exemplo de ordem retornada:", {
        _id: ordens[0]._id,
        numeroOS: ordens[0].numeroOS,
        cliente: ordens[0].cliente,
      })
    }

    res.json(ordens)
  } catch (error) {
    console.error("[NovaOSRouter] Erro ao listar ordens:", error)
    res.status(500).json({
      erro: "Erro ao listar ordens",
      detalhes: error.message,
    })
  }
})

// GET /api/novaos/:id - Buscar ordem por ID
router.get("/:id", async (req, res) => {
  try {
    console.log(`[NovaOSRouter] Buscando ordem ID: ${req.params.id}`)

    if (!NovaOS) {
      return res.status(500).json({ erro: "Modelo não carregado" })
    }

    const ordem = await NovaOS.findById(req.params.id)

    if (!ordem) {
      return res.status(404).json({ erro: "Ordem não encontrada" })
    }

    console.log(`[NovaOSRouter] Ordem encontrada - numeroOS: ${ordem.numeroOS}`)
    res.json(ordem)
  } catch (error) {
    console.error("[NovaOSRouter] Erro ao buscar ordem:", error)
    res.status(500).json({ erro: "Erro ao buscar ordem" })
  }
})

// POST /api/novaos - Criar nova ordem
router.post("/", async (req, res) => {
  try {
    console.log("[NovaOSRouter] Criando nova ordem...")
    console.log("[NovaOSRouter] numeroOS recebido:", req.body.numeroOS)

    if (!NovaOS) {
      return res.status(500).json({ erro: "Modelo não carregado" })
    }

    // Verificar se numeroOS foi enviado
    if (!req.body.numeroOS) {
      console.error("[NovaOSRouter] ERRO: numeroOS não foi enviado!")
      return res.status(400).json({ erro: "numeroOS é obrigatório" })
    }

    // Preparar dados garantindo que numeroOS seja salvo
    const dados = {
      ...req.body,
      numeroOS: req.body.numeroOS, // Garantir que numeroOS seja salvo
      equipamento: req.body.equipamento || req.body.descricao || "Não informado",
    }

    console.log("[NovaOSRouter] Dados a serem salvos:", {
      numeroOS: dados.numeroOS,
      cliente: dados.cliente,
      valorTotal: dados.valorTotal,
    })

    const novaOrdem = new NovaOS(dados)
    const ordemSalva = await novaOrdem.save()

    console.log(`[NovaOSRouter] ✅ Ordem criada com sucesso!`)
    console.log(`[NovaOSRouter] ID: ${ordemSalva._id}`)
    console.log(`[NovaOSRouter] numeroOS salvo: ${ordemSalva.numeroOS}`)

    res.status(201).json(ordemSalva)
  } catch (error) {
    console.error("[NovaOSRouter] Erro ao criar ordem:", error)
    res.status(500).json({
      erro: "Erro ao criar ordem",
      detalhes: error.message,
    })
  }
})

// DELETE /api/novaos/:id - Excluir ordem
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id
    console.log(`[NovaOSRouter] Excluindo ordem ID: ${id}`)

    if (!NovaOS) {
      console.error("[NovaOSRouter] Modelo não carregado")
      return res.status(500).json({ erro: "Modelo não carregado" })
    }

    // Verificar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("[NovaOSRouter] ID inválido:", id)
      return res.status(400).json({ erro: "ID inválido" })
    }

    console.log(`[NovaOSRouter] Tentando excluir ordem com ID: ${id}`)
    const ordemExcluida = await NovaOS.findByIdAndDelete(id)

    if (!ordemExcluida) {
      console.log(`[NovaOSRouter] Ordem não encontrada com ID: ${id}`)
      return res.status(404).json({ erro: "Ordem não encontrada" })
    }

    console.log(`[NovaOSRouter] Ordem excluída com sucesso: ${ordemExcluida._id}`)
    res.json({ message: "Ordem excluída com sucesso" })
  } catch (error) {
    console.error("[NovaOSRouter] Erro ao excluir ordem:", error)
    res.status(500).json({
      erro: "Erro ao excluir ordem",
      detalhes: error.message,
    })
  }
})

// PUT /api/novaos/:id - Atualizar ordem
router.put("/:id", async (req, res) => {
  try {
    console.log(`[NovaOSRouter] Atualizando ordem ID: ${req.params.id}`)
    console.log("[NovaOSRouter] numeroOS nos dados:", req.body.numeroOS)

    if (!NovaOS) {
      return res.status(500).json({ erro: "Modelo não carregado" })
    }

    const ordemAtualizada = await NovaOS.findByIdAndUpdate(req.params.id, req.body, { new: true })

    if (!ordemAtualizada) {
      return res.status(404).json({ erro: "Ordem não encontrada" })
    }

    console.log(`[NovaOSRouter] Ordem atualizada: ${ordemAtualizada._id}`)
    console.log(`[NovaOSRouter] numeroOS após atualização: ${ordemAtualizada.numeroOS}`)
    res.json(ordemAtualizada)
  } catch (error) {
    console.error("[NovaOSRouter] Erro ao atualizar ordem:", error)
    res.status(500).json({
      erro: "Erro ao atualizar ordem",
      detalhes: error.message,
    })
  }
})

console.log("[NovaOSRouter] Router configurado")
module.exports = router
