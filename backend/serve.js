const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())

// Conexão com o MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso"))
  .catch((err) => console.error("Erro ao conectar no MongoDB:", err))

// Rotas
const estoqueRoutes = require("./router/EstoqueRouter")
app.use("/api/estoque", estoqueRoutes)

const pedidoRoutes = require("./router/PedidoRouter")
app.use("/api/pedido", pedidoRoutes)

const novaOSRoutes = require("./router/NovaOSRouter")
app.use("/api/novaos", novaOSRoutes)

const cadastroProdutoRoutes = require("./router/CadastroProdutoRouter")
app.use("/api/produto", cadastroProdutoRoutes)

const editarProdutoRoutes = require("./router/EditarProdutoRouter")
app.use("/api/editarproduto", editarProdutoRoutes)

const financeiroRoutes = require("./router/FinanceiroRouter")
app.use("/api/financeiro", financeiroRoutes)

const reciboRoutes = require("./router/ReciboRouter")
app.use("/api/recibo", reciboRoutes)

const editarNovaOSRoutes = require("./router/EditarNovaOSRouter")
app.use("/api/editarnovaos", editarNovaOSRoutes)

// SERVIÇOS - usando apenas uma rota unificada
const servicoRoutes = require("./router/CadastroServicoRouter")
app.use("/api/servico", servicoRoutes)

const listaservicoRoutes = require("./router/ListaServicoRouter")
app.use("/api/listaservico", listaservicoRoutes) // Alias para compatibilidade

const editarServicoRoutes = require("./router/EditarServicoRouter")
app.use("/api/editarservico", editarServicoRoutes)

const cadastroClienteRoutes = require("./router/CadastroClienteRouter")
app.use("/api/cliente", cadastroClienteRoutes)

const listaClienteRoutes = require("./router/ListaClienteRouter")
app.use("/api/listacliente", listaClienteRoutes)

const editarClienteRoutes = require("./router/EditarClienteRouter")
app.use("/api/editarcliente", editarClienteRoutes)

const listafuncionarioRoutes = require('./router/ListaFuncionarioRouter');
app.use('/api/listafuncionario', listafuncionarioRoutes);

const cadastroFuncionarioRoutes = require("./router/CadastroFuncionarioRouter")
app.use("/api/funcionario", cadastroFuncionarioRoutes)


// Log das rotas registradas
console.log("Rotas registradas:")

// Inicialização do servidor
app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"))
