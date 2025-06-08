<template>
  <div class="cadastro-layout">
    <!-- MENU LATERAL -->
    <aside class="sidebar">
      <ul class="menu">
        <li><router-link to="/">📊 Painel</router-link></li>
        <li><router-link to="/estoque">📦 Estoque</router-link></li>
        <li><router-link to="/listacliente">👥 Clientes</router-link></li>
        <li><router-link to="/listaservico">🛠️ Serviços</router-link></li>
        <li class="active"><a href="#">🧰 Técnicos</a></li>
        <li><router-link to="/relatorio">📈 Relatórios</router-link></li>
      </ul>
    </aside>

    <!-- CONTEÚDO PRINCIPAL -->
    <main class="conteudo-principal">
      <div class="cadastro-container">
        <div class="topo">
          <h1>Lista de Técnicos</h1>
          <router-link to="/funcionario" class="botao-novo">+ Novo Técnico</router-link>
        </div>

        <div class="barra-busca">
          <input type="text" placeholder="🔍 Pesquisar técnico" v-model="termoBusca" />
        </div>

        <table class="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Função</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="func in funcionariosFiltrados" :key="func._id">
              <td>{{ func.nome }}</td>
              <td>{{ func.cpf }}</td>
              <td>{{ func.funcao }}</td>
              <td>{{ func.email }}</td>
              <td>{{ func.telefone }}</td>
              <td>
                <router-link 
                  :to="`/editarfuncionario/${func._id}`" 
                  class="botao-editar">
                  Editar
                </router-link>
                <button class="botao-excluir" @click="excluirFuncionario(func._id)">
                  Excluir
                </button>
              </td>
            </tr>
            <tr v-if="funcionariosFiltrados.length === 0">
              <td colspan="6" class="sem-resultados">Nenhum técnico encontrado</td>
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
  name: 'ListaFuncionario',
  data() {
    return {
      funcionarios: [],
      termoBusca: ''
    };
  },
  computed: {
    funcionariosFiltrados() {
      if (!this.termoBusca) return this.funcionarios;
      const termo = this.termoBusca.toLowerCase();
      return this.funcionarios.filter(f =>
        f.nome.toLowerCase().includes(termo) ||
        (f.cpf || '').includes(termo) ||
        (f.funcao || '').toLowerCase().includes(termo) ||
        (f.email || '').toLowerCase().includes(termo) ||
        (f.telefone || '').includes(termo)
      );
    }
  },
  methods: {
    async carregarFuncionarios() {
      try {
        const res = await axios.get('http://localhost:3000/api/funcionario');
        this.funcionarios = res.data;
      } catch (err) {
        console.error('Erro ao carregar técnicos:', err);
      }
    },
    async excluirFuncionario(id) {
      if (confirm('Deseja excluir este técnico?')) {
        try {
          await axios.delete(`http://localhost:3000/api/funcionario/${id}`);
          this.carregarFuncionarios();
          alert('Técnico excluído com sucesso!');
        } catch (err) {
          console.error('Erro ao excluir técnico:', err);
        }
      }
    }
  },
  mounted() {
    this.carregarFuncionarios();
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
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.tabela th,
.tabela td {
  padding: 12px 15px;
  text-align: left;
  font-size: 14px;
  border-bottom: 1px solid #eee;
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
  text-decoration: none;
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
