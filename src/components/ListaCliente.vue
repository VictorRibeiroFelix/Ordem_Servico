<template>
  <div class="cadastro-layout">
    <!-- MENU LATERAL -->
    <aside class="sidebar">
      <ul class="menu">
        <li><router-link to="/">📊 Painel</router-link></li>
        <li><router-link to="/estoque">📦 Estoque</router-link></li>
        <li class="active"><a href="#">👥 Clientes</a></li>
        <li><router-link to="/listaservico">🛠️ Serviços</router-link></li>
        <li><router-link to="/listafuncionario">🧰 Técnicos</router-link></li>
        <li><router-link to="/relatorio">📈 Relatórios</router-link></li>
      </ul>
    </aside>

    <!-- CONTEÚDO PRINCIPAL -->
    <main class="conteudo-principal">
      <div class="cadastro-container">
        <div class="topo">
          <h1>Lista de Clientes</h1>
          <router-link to="/cliente" class="botao-novo">+ Novo Cliente</router-link>
        </div>

        <div class="barra-busca">
          <input
            type="text"
            placeholder="🔍 Pesquisar cliente"
            v-model="termoBusca"
          />
        </div>

        <table class="tabela">
  <thead>
    <tr>
      <th>Nome</th>
      <th>CPF/CNPJ</th>
      <th>Email</th>
      <th>Telefone</th>
      <th>Endereço</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="cliente in clientesFiltrados" :key="cliente._id">
      <td>{{ cliente.nome }}</td>
      <td>{{ cliente.cpfCnpj }}</td>
      <td>{{ cliente.email }}</td>
      <td>{{ cliente.telefone }}</td>
      <td>{{ cliente.endereco }}</td>
      <td>
      
        <router-link :to="`/editarcliente/${cliente._id}`" class="botao-editar">Editar</router-link>

        <button class="botao-excluir" @click="excluirCliente(cliente._id)">Excluir</button>
      </td>
    </tr>
    <tr v-if="clientesFiltrados.length === 0">
      <td colspan="6" class="sem-resultados">Nenhum cliente encontrado</td>
    </tr>
  </tbody>
</table>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ListaCliente',
  data() {
    return {
      clientes: [],
      termoBusca: ''
    };
  },
  computed: {
    clientesFiltrados() {
  if (!this.termoBusca) return this.clientes;
  const termo = this.termoBusca.toLowerCase();
  return this.clientes.filter(c =>
    c.nome.toLowerCase().includes(termo) ||
    (c.cpfCnpj || '').toLowerCase().includes(termo) ||
    (c.email || '').toLowerCase().includes(termo) ||
    (c.telefone || '').includes(termo) ||
    (c.endereco || '').toLowerCase().includes(termo)
  );
}

  },
  methods: {
    async carregarClientes() {
      try {
        const res = await axios.get('http://localhost:3000/api/cliente');
        this.clientes = res.data;
      } catch (err) {
        console.error('Erro ao carregar clientes:', err);
      }
    },
    async excluirCliente(id) {
      if (confirm('Deseja realmente excluir este cliente?')) {
        try {
          await axios.delete(`http://localhost:3000/api/cliente/${id}`);
          this.carregarClientes();
          alert('Cliente excluído com sucesso!');
        } catch (err) {
          console.error('Erro ao excluir cliente:', err);
        }
      }
    }
  },
  mounted() {
    this.carregarClientes();
  }
};
</script>

<style scoped>
.cadastro-layout {
  display: flex;
  font-family: 'Segoe UI', sans-serif;
}

.sidebar {
  width: 130px;
  background-color: #fff;
  padding: 20px;
  border-right: 1px solid #eee;
  min-height: 100vh;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  margin-bottom: 16px;
}

.menu li a {
  text-decoration: none;
  color: #444;
  font-weight: 500;
}

.menu li.active a {
  background-color: #f6f4ea;
  padding: 8px 12px;
  border-radius: 8px;
  display: block;
}

.conteudo-principal {
  flex-grow: 1;
  padding: 40px 60px;
  background-color: #fff;
}

.cadastro-container {
  max-width: 1300px;
  margin: 0 auto;
}

.topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 26px;
  color: #333;
  margin: 0;
}

.botao-novo {
  background: #14b866;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
}

.barra-busca input {
  width: 97%;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ddd;
  margin-bottom: 20px;
  background-color: #f6f4ea;
  font-size: 15px;
}

.tabela {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.tabela th, .tabela td {
  padding: 12px 15px;
  text-align: left;
  font-size: 14px;
  word-wrap: break-word;
}


.tabela th {
  background: #f9f9f9;
  font-weight: 600;
}

.botao-editar,
.botao-excluir {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 5px;
}

.botao-editar {
  background-color: #e1f0ff;
  color: #1a73e8;
  border: 1px solid #d2e3fc;
}

.botao-excluir {
  background-color: #ffebee;
  color: #d32f2f;
  border: 1px solid #ffcdd2;
}

.sem-resultados {
  text-align: center;
  color: #888;
  padding: 20px;
}
</style>
