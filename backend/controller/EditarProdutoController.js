const Produto = require("../model/Estoque")
const mongoose = require("mongoose")

// Buscar produto específico pelo código
exports.buscarProdutoPorCodigo = async (req, res) => {
  try {
    const codigo = req.params.codigo
    console.log(`[EditarProdutoController] Buscando produto com código: ${codigo}`)

    // Tenta buscar pelo campo 'codigo'
    let produto = await Produto.findOne({ codigo: codigo })

    // Se não encontrar, tenta buscar pelo _id
    if (!produto && mongoose.Types.ObjectId.isValid(codigo)) {
      produto = await Produto.findById(codigo)
    }

    if (!produto) {
      console.log(`[EditarProdutoController] Produto com código ${codigo} não encontrado`)
      return res.status(404).json({ message: "Produto não encontrado" })
    }

    console.log(`[EditarProdutoController] Produto encontrado: ${produto.nome}`)
    res.json(produto)
  } catch (error) {
    console.error("[EditarProdutoController] Erro ao buscar produto:", error)
    res.status(500).json({ message: "Erro ao buscar produto" })
  }
}

// Atualizar produto
exports.atualizarProduto = async (req, res) => {
  try {
    const codigo = req.params.codigo
    const dadosAtualizados = {
      ...req.body,
      ultimaAtualizacao: new Date(),
    }

    console.log(`[EditarProdutoController] Atualizando produto ${codigo}:`, dadosAtualizados)

    // Tenta atualizar pelo campo 'codigo'
    let produtoAtualizado = await Produto.findOneAndUpdate({ codigo: codigo }, dadosAtualizados, { new: true })

    // Se não encontrar, tenta atualizar pelo _id
    if (!produtoAtualizado && mongoose.Types.ObjectId.isValid(codigo)) {
      produtoAtualizado = await Produto.findByIdAndUpdate(codigo, dadosAtualizados, { new: true })
    }

    if (!produtoAtualizado) {
      return res.status(404).json({ message: "Produto não encontrado" })
    }

    console.log(`[EditarProdutoController] Produto atualizado com sucesso`)
    res.json(produtoAtualizado)
  } catch (error) {
    console.error("[EditarProdutoController] Erro ao atualizar produto:", error)
    res.status(500).json({ message: "Erro ao atualizar produto" })
  }
}
