<template>
  <div class="estoque-layout">
    <!-- MENU LATERAL -->
    <aside class="sidebar">
      <ul class="menu">
        <li>
          <router-link to="/">📊 Painel</router-link>
        </li>
        <li class="active"><a href="#">📦 Estoque</a></li>
        <li><a href="/listacliente">👥 Clientes</a></li>
        <li><a href="/listaservico">🛠️ Serviços</a></li>
        <li><a href="/listafuncionario">🧰 Técnicos</a></li>
        <li>
          <router-link to="/relatorio">📈 Relatórios</router-link>
        </li>
      </ul>
    </aside>

    <!-- CONTEÚDO PRINCIPAL -->
    <div class="estoque-container">
      <div class="topo">
        <h1>Gestão de estoque</h1>
        <router-link to="/produto" class="botao-novo">+ Nova Peça</router-link>
      </div>

      <div class="search-bar">
        <input type="text" placeholder="🔍 Pesquisa" v-model="busca" />
      </div>

      <!-- Mensagem de erro -->
      <div v-if="erro" class="erro-mensagem">
        {{ erro }}
      </div>

      <!-- Loading -->
      <div v-if="carregando" class="loading">
        Carregando produtos...
      </div>

      <table class="tabela" v-else>
        <thead>
          <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Quantidade</th>
              <th>Preço</th>
              <th>Última Atualização</th>
              <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in itensFiltrados" :key="item.codigo || item._id">
            <td>{{ item.codigo || item._id }}</td>
            <td>{{ item.nome }}</td>
            <td>{{ item.categoria }}</td>
            <td>{{ item.quantidade }}</td>
            <td>R$ {{ formatarPreco(item.preco) }}</td>
            <td>{{ formatarData(item.ultimaAtualizacao || item.createdAt) }}</td>
            <td>
              <router-link 
                :to="{ path: '/editarproduto', query: { codigo: item.codigo || item._id } }" 
                class="btn-editar"
              >
                Editar
              </router-link>
              <button class="btn-excluir" @click="confirmarExclusao(item.codigo || item._id)">
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mensagem quando não há itens -->
      <div v-if="!carregando && itens.length === 0" class="sem-itens">
        Nenhum produto encontrado.
      </div>

      <!-- Modal de confirmação -->
      <div v-if="mostrarModal" class="modal-overlay">
        <div class="modal">
          <h3>Confirmar Exclusão</h3>
          <p>Tem certeza que deseja excluir o item {{ itemParaExcluir }}?</p>
          <div class="modal-botoes">
            <button @click="cancelarExclusao" class="botao-cancelar">Cancelar</button>
            <button @click="excluirItem" class="botao-confirmar">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'GestaoEstoque',
  data() {
    return {
      itens: [],
      busca: '',
      mostrarModal: false,
      itemParaExcluir: null,
      carregando: false,
      erro: null,
      // URLs corretas baseadas no seu server.js
      apiBaseUrl: 'http://localhost:3000/api'
    };
  },
  computed: {
    itensFiltrados() {
      const termo = this.busca.toLowerCase();
      return this.itens.filter((item) =>
        item.nome.toLowerCase().includes(termo) ||
        item.categoria.toLowerCase().includes(termo) ||
        (item.codigo && item.codigo.toString().toLowerCase().includes(termo))
      );
    },
  },
  methods: {
    async carregarItens() {
      try {
        this.carregando = true;
        this.erro = null;
        
        // Tenta primeiro a rota de estoque, depois produto
        let response;
        try {
          response = await axios.get(`${this.apiBaseUrl}/estoque`);
        } catch (estoqueError) {
          console.log('Tentando rota /produto...');
          response = await axios.get(`${this.apiBaseUrl}/produto`);
        }
        
        if (response.data && Array.isArray(response.data)) {
          this.itens = response.data;
        } else if (response.data) {
          // Se não for array, pode ser um objeto com os dados
          this.itens = Array.isArray(response.data.produtos) ? response.data.produtos : [response.data];
        } else {
          this.erro = 'Formato de dados inválido recebido do servidor';
        }
      } catch (err) {
        console.error('Erro ao carregar estoque:', err);
        
        if (err.response) {
          this.erro = `Erro ${err.response.status}: ${err.response.data.message || 'Erro ao carregar produtos'}`;
        } else if (err.request) {
          this.erro = 'Servidor não respondeu. Verifique se a API está rodando em http://localhost:3000';
        } else {
          this.erro = `Erro na requisição: ${err.message}`;
        }
      } finally {
        this.carregando = false;
      }
    },
    
    formatarData(data) {
      if (!data) return '—';
      const d = new Date(data);
      const dia = String(d.getDate()).padStart(2, '0');
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const ano = d.getFullYear();
      return `${dia}/${mes}/${ano}`;
    },
    
    formatarPreco(preco) {
      if (!preco) return '0,00';
      return parseFloat(preco).toFixed(2).replace('.', ',');
    },
    
    confirmarExclusao(codigo) {
      this.itemParaExcluir = codigo;
      this.mostrarModal = true;
    },
    
    cancelarExclusao() {
      this.mostrarModal = false;
      this.itemParaExcluir = null;
    },
    
    async excluirItem() {
      try {
        this.carregando = true;
        
        // Tenta excluir usando a rota de estoque
        await axios.delete(`${this.apiBaseUrl}/estoque/${this.itemParaExcluir}`);
        
        // Remove o item da lista local
        this.itens = this.itens.filter((item) => 
          (item.codigo || item._id) !== this.itemParaExcluir
        );
        this.mostrarModal = false;
        this.itemParaExcluir = null;
        
      } catch (err) {
        console.error('Erro ao excluir produto:', err);
        
        if (err.response) {
          this.erro = `Erro ${err.response.status}: ${err.response.data.message || 'Erro ao excluir produto'}`;
        } else {
          this.erro = 'Erro ao excluir produto. Tente novamente.';
        }
      } finally {
        this.carregando = false;
      }
    },
  },
  mounted() {
    this.carregarItens();
  },
};
</script>

<style scoped>
.estoque-layout {
  display: flex;
}

/* SIDEBAR */
.sidebar {
  width: 130px;
  background-color: #fff;
  padding: 20px;
  border-right: 1px solid #eee;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sidebar h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 24px;
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

/* CONTEÚDO PRINCIPAL */
.estoque-container {
  flex-grow: 1;
  padding: 40px 60px;
}

.topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 28px;
  font-weight: bold;
}

.search-bar {
  background: #f6f4ea;
  padding: 12px 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  font-size: 15px;
  border: none;
  background: transparent;
  outline: none;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
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

.tabela a {
  color: #007bff;
  font-weight: 500;
  text-decoration: none;
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

/* AÇÕES */
.btn-editar {
  background-color: #e1f0ff;
  color: #1a73e8;
  border: 1px solid #d2e3fc;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  margin-right: 8px;
}

.btn-editar:hover {
  background-color: #d2e3fc;
}

.btn-excluir {
  background-color: #ffebee;
  color: #d32f2f;
  border: 1px solid #ffcdd2;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-excluir:hover {
  background-color: #ffcdd2;
}

/* Estados */
.erro-mensagem {
  background-color: #ffebee;
  color: #d32f2f;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #ffcdd2;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

.sem-itens {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 16px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}

.modal h3 {
  margin-top: 0;
  color: #2c3e50;
}

.modal p {
  margin: 20px 0;
}

.modal-botoes {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.botao-cancelar {
  background: #ecf0f1;
  color: #7f8c8d;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.botao-cancelar:hover {
  background: #d5dbdb;
}

.botao-confirmar {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.botao-confirmar:hover {
  background: #c0392b;
}
</style>
