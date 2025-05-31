const Estoque = require("../model/Estoque")
const mongoose = require("mongoose")

// Listar todos os produtos
exports.listarProdutos = async (req, res) => {
  try {
    console.log("[EstoqueController] Buscando todos os produtos...")
    const produtos = await Estoque.find()
    console.log(`[EstoqueController] Encontrados ${produtos.length} produtos`)
    res.json(produtos)
  } catch (error) {
    console.error("[EstoqueController] Erro ao buscar produtos:", error)
    res.status(500).json({ message: "Erro ao buscar produtos" })
  }
}

// Buscar produto específico pelo código
exports.buscarProdutoPorCodigo = async (req, res) => {
  try {
    const codigo = req.params.codigo
    console.log(`[EstoqueController] Buscando produto com código: ${codigo}`)

    // Tenta buscar pelo campo 'codigo'
    let produto = await Estoque.findOne({ codigo: codigo })

    // Se não encontrar, tenta buscar pelo _id
    if (!produto && mongoose.Types.ObjectId.isValid(codigo)) {
      produto = await Estoque.findById(codigo)
    }

    if (!produto) {
      console.log(`[EstoqueController] Produto com código ${codigo} não encontrado`)
      return res.status(404).json({ message: "Produto não encontrado" })
    }

    console.log(`[EstoqueController] Produto encontrado: ${produto.nome}`)
    res.json(produto)
  } catch (error) {
    console.error("[EstoqueController] Erro ao buscar produto:", error)
    res.status(500).json({ message: "Erro ao buscar produto" })
  }
}

// Excluir produto
exports.excluirProduto = async (req, res) => {
  try {
    const codigo = req.params.codigo
    console.log(`[EstoqueController] Excluindo produto com código: ${codigo}`)

    // Tenta excluir pelo campo 'codigo'
    let resultado = await Estoque.findOneAndDelete({ codigo: codigo })

    // Se não encontrar, tenta excluir pelo _id
    if (!resultado && mongoose.Types.ObjectId.isValid(codigo)) {
      resultado = await Estoque.findByIdAndDelete(codigo)
    }

    if (!resultado) {
      return res.status(404).json({ message: "Produto não encontrado" })
    }

    console.log(`[EstoqueController] Produto excluído com sucesso`)
    res.json({ message: "Produto excluído com sucesso" })
  } catch (error) {
    console.error("[EstoqueController] Erro ao excluir produto:", error)
    res.status(500).json({ message: "Erro ao excluir produto" })
  }
}
