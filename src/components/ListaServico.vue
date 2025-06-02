<template>
  <div class="servico-layout">
    <!-- MENU LATERAL -->
    <aside class="sidebar">
      <ul class="menu">
        <li><router-link to="/">📊 Painel</router-link></li>
        <li><router-link to="/estoque">📦 Estoque</router-link></li>
        <li><router-link to="/listacliente">👥 Clientes</router-link></li>
        <li class="active"><a href="#">🛠️ Serviços</a></li>
        <li><router-link to="/cadastrofuncionario">🧰 Técnicos</router-link></li>
        <li><router-link to="/relatorioos">📈 Relatórios</router-link></li>
      </ul>
    </aside>

    <!-- CONTEÚDO PRINCIPAL -->
    <div class="servico-container">
      <div class="topo">
        <h1>Lista de Serviços</h1>
        <router-link to="/servico" class="botao-novo">+ Novo serviço</router-link>
      </div>

      <div class="search-bar">
        <input
          type="text"
          placeholder="🔍 Pesquisar serviço"
          v-model="termoBusca"
          @input="filtrarServicos"
        />
      </div>

      <!-- Mensagem de erro -->
      <div v-if="erro" class="erro-mensagem">
        {{ erro }}
        <button @click="carregarServicos" class="btn-tentar-novamente">Tentar Novamente</button>
      </div>

      <!-- Loading -->
      <div v-if="carregando" class="loading">
        Carregando serviços...
      </div>

      <table class="tabela" v-else>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Valor</th>
            <th>Tempo Médio</th>
            <th>Data Criação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="serv in servicosFiltrados" :key="serv._id">
            <td><strong>{{ serv.codigo }}</strong></td>
            <td>{{ serv.nome }}</td>
            <td>{{ formatarMoeda(serv.valor) }}</td>
            <td>{{ serv.tempo_medio }} min</td>
            <td>{{ obterDataFormatada(serv) }}</td>
            <td>
              <router-link 
                :to="{ path: '/editarservico', query: { id: serv._id, edit: true } }" 
                class="btn-editar"
              >
                Editar
              </router-link>
              <button class="btn-excluir" @click="confirmarExclusao(serv._id, serv.nome)">
                Excluir
              </button>
            </td>
          </tr>
          <!-- Linha para quando não há serviços -->
          <tr v-if="servicosFiltrados.length === 0">
            <td colspan="7" class="sem-resultados">
              {{ termoBusca ? 'Nenhum serviço encontrado para a busca.' : 'Nenhum serviço disponível.' }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Mensagem quando não há serviços -->
      <div v-if="!carregando && servicos.length === 0" class="sem-itens">
        Nenhum serviço encontrado.
      </div>

      <!-- Modal de confirmação -->
      <div v-if="mostrarModal" class="modal-overlay">
        <div class="modal">
          <h3>Confirmar Exclusão</h3>
          <p>Tem certeza que deseja excluir o serviço <strong>"{{ nomeServicoParaExcluir }}"</strong>?</p>
          <div class="modal-botoes">
            <button @click="cancelarExclusao" class="botao-cancelar">Cancelar</button>
            <button @click="excluirServicoFinal" class="botao-confirmar">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ListaServicoView',
  data() {
    return {
      servicos: [],
      servicosFiltrados: [],
      termoBusca: '',
      carregando: false,
      erro: null,
      mostrarModal: false,
      servicoParaExcluir: null,
      nomeServicoParaExcluir: '',
      apiBaseUrl: 'http://localhost:3000/api'
    };
  },
  
  created() {
    this.carregarServicos();
  },
  
  // Recarregar dados quando o componente é ativado (após navegação)
  activated() {
    this.carregarServicos();
  },
  
  // Recarregar dados quando a rota muda
  watch: {
    '$route': {
      handler() {
        this.carregarServicos();
      },
      immediate: true
    }
  },
  
  methods: {
    async carregarServicos() {
      try {
        this.carregando = true;
        this.erro = null;
        
        console.log('🔄 Carregando serviços...');
        
        // Tenta buscar da rota /api/servico primeiro, depois /api/listaservico
        let response;
        try {
          response = await axios.get(`${this.apiBaseUrl}/servico`);
          console.log('✅ Dados carregados da rota /api/servico');
        } catch (error) {
          console.log('⚠️ Rota /api/servico falhou, tentando /api/listaservico...');
          response = await axios.get(`${this.apiBaseUrl}/listaservico`);
          console.log('✅ Dados carregados da rota /api/listaservico');
        }
        
        // Verifica se a resposta tem dados
        if (response.data && Array.isArray(response.data)) {
          this.servicos = response.data;
          console.log(`📊 ${this.servicos.length} serviços carregados`);
          
          // Log para debug - mostra o primeiro serviço
          if (this.servicos.length > 0) {
            console.log('Exemplo de serviço:', this.servicos[0]);
          }
        } else {
          console.log('⚠️ Resposta da API não é um array:', response.data);
          this.servicos = [];
        }
        
        // Aplica o filtro atual
        this.filtrarServicos();
        
      } catch (error) {
        console.error('❌ Erro ao carregar serviços:', error);
        
        if (error.response) {
          this.erro = `Erro ${error.response.status}: ${error.response.data?.message || 'Erro ao carregar serviços'}`;
        } else if (error.request) {
          this.erro = 'Servidor não respondeu. Verifique se a API está rodando em http://localhost:3000';
        } else {
          this.erro = `Erro na requisição: ${error.message}`;
        }
        
        this.servicos = [];
        this.servicosFiltrados = [];
      } finally {
        this.carregando = false;
      }
    },
    
    filtrarServicos() {
      const termo = this.termoBusca.toLowerCase();
      
      if (!termo) {
        this.servicosFiltrados = [...this.servicos];
      } else {
        this.servicosFiltrados = this.servicos.filter(serv =>
          serv.nome.toLowerCase().includes(termo) ||
          serv.codigo.toLowerCase().includes(termo) ||
          (serv.descricao && serv.descricao.toLowerCase().includes(termo))
        );
      }
      
      console.log(`🔍 Filtro aplicado: "${termo}" - ${this.servicosFiltrados.length} resultados`);
    },
    
    formatarMoeda(valor) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor || 0);
    },
    
    formatarData(data) {
      if (!data) return '-';
      
      try {
        // Tenta diferentes formatos de data
        let dataObj;
        
        if (typeof data === 'string') {
          dataObj = new Date(data);
        } else if (data instanceof Date) {
          dataObj = data;
        } else {
          return '-';
        }
        
        // Verifica se a data é válida
        if (isNaN(dataObj.getTime())) {
          console.warn('Data inválida:', data);
          return '-';
        }
        
        return dataObj.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      } catch (error) {
        console.error('Erro ao formatar data:', error, data);
        return '-';
      }
    },

    // Nova função para obter a data formatada, tentando diferentes campos
    obterDataFormatada(servico) {
      // Tenta diferentes campos de data em ordem de prioridade
      const dataFields = ['dataCriacao', 'createdAt', 'updatedAt', 'data'];
      
      for (const field of dataFields) {
        if (servico[field]) {
          return this.formatarData(servico[field]);
        }
      }
      
      // Se chegou aqui, não encontrou nenhum campo de data válido
      return this.formatarDataAlternativa(servico);
    },
    
    // Método alternativo para extrair data de criação
    formatarDataAlternativa(servico) {
      // Tenta extrair do _id do MongoDB (contém timestamp de criação)
      if (servico._id && servico._id.length >= 8) {
        try {
          // O ObjectId do MongoDB contém um timestamp nos primeiros 4 bytes
          const timestamp = parseInt(servico._id.substring(0, 8), 16) * 1000;
          return this.formatarData(new Date(timestamp));
        } catch (e) {
          console.warn('Não foi possível extrair timestamp do _id:', e);
        }
      }
      
      // Última alternativa: data atual
      return new Date().toLocaleDateString('pt-BR');
    },
    
    confirmarExclusao(id, nome) {
      this.servicoParaExcluir = id;
      this.nomeServicoParaExcluir = nome;
      this.mostrarModal = true;
    },
    
    cancelarExclusao() {
      this.mostrarModal = false;
      this.servicoParaExcluir = null;
      this.nomeServicoParaExcluir = '';
    },
    
    async excluirServicoFinal() {
      try {
        console.log(`🗑️ Excluindo serviço: ${this.servicoParaExcluir}`);
        
        // Tenta excluir usando ambas as rotas
        try {
          await axios.delete(`${this.apiBaseUrl}/servico/${this.servicoParaExcluir}`);
          console.log('✅ Serviço excluído via /api/servico');
        } catch (error) {
          console.log('⚠️ Tentando excluir via /api/listaservico...');
          await axios.delete(`${this.apiBaseUrl}/listaservico/${this.servicoParaExcluir}`);
          console.log('✅ Serviço excluído via /api/listaservico');
        }
        
        // Recarrega a lista
        await this.carregarServicos();
        this.cancelarExclusao();
        
        alert('Serviço excluído com sucesso!');
        
      } catch (error) {
        console.error('❌ Erro ao excluir serviço:', error);
        alert(`Erro ao excluir serviço: ${error.response?.data?.message || error.message}`);
      }
    }
  }
};
</script>


<style scoped>
.servico-layout {
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
.servico-container {
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

.sem-resultados {
  text-align: center;
  color: #999;
  padding: 30px 0;
  font-style: italic;
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

.btn-tentar-novamente {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  display: block;
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
