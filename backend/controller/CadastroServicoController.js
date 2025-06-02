const Servico = require("../model/ListaServico")

class CadastroServicoController {
  async criarServico(req, res) {
    try {
      console.log("[CadastroServicoController] Criando novo serviço:", req.body)

      const novoServico = new Servico(req.body)
      await novoServico.save()

      console.log("[CadastroServicoController] Serviço criado com sucesso:", novoServico)

      // Verificar se o serviço foi realmente salvo
      const servicoSalvo = await Servico.findById(novoServico._id)
      console.log(
        "[CadastroServicoController] Verificação após salvar:",
        servicoSalvo ? "Encontrado" : "Não encontrado",
      )

      // Contar quantos serviços existem no total
      const total = await Servico.countDocuments()
      console.log(`[CadastroServicoController] Total de serviços no banco: ${total}`)

      res.status(201).json(novoServico)
    } catch (error) {
      console.error("[CadastroServicoController] Erro ao criar serviço:", error)
      res.status(500).json({ message: "Erro ao criar serviço", error: error.message })
    }
  }

  async listarServicos(req, res) {
    try {
      const servicos = await Servico.find()
      console.log(`[CadastroServicoController] Encontrados ${servicos.length} serviços`)
      res.json(servicos)
    } catch (error) {
      console.error("[CadastroServicoController] Erro ao listar serviços:", error)
      res.status(500).json({ message: "Erro ao listar serviços", error: error.message })
    }
  }

  async buscarServico(req, res) {
    try {
      const servico = await Servico.findOne({ codigo: req.params.codigo })
      if (!servico) {
        return res.status(404).json({ message: "Serviço não encontrado" })
      }
      res.json(servico)
    } catch (error) {
      console.error("[CadastroServicoController] Erro ao buscar serviço:", error)
      res.status(500).json({ message: "Erro ao buscar serviço", error: error.message })
    }
  }

  async atualizarServico(req, res) {
    try {
      const servico = await Servico.findOneAndUpdate({ codigo: req.params.codigo }, req.body, { new: true })
      if (!servico) {
        return res.status(404).json({ message: "Serviço não encontrado" })
      }
      res.json(servico)
    } catch (error) {
      console.error("[CadastroServicoController] Erro ao atualizar serviço:", error)
      res.status(500).json({ message: "Erro ao atualizar serviço", error: error.message })
    }
  }

  async excluirServico(req, res) {
    try {
      const servico = await Servico.findOneAndDelete({ codigo: req.params.codigo })
      if (!servico) {
        return res.status(404).json({ message: "Serviço não encontrado" })
      }
      res.json({ message: "Serviço excluído com sucesso" })
    } catch (error) {
      console.error("[CadastroServicoController] Erro ao excluir serviço:", error)
      res.status(500).json({ message: "Erro ao excluir serviço", error: error.message })
    }
  }
}

module.exports = new CadastroServicoController()
