<template>
  <div class="container">
    <div class="form-card">
      <h2>Editar Serviço</h2>

      <!-- Loading -->
      <div v-if="carregando" class="loading">
        <p>Carregando dados do serviço...</p>
      </div>

      <!-- Erro -->
      <div v-else-if="erro" class="erro-mensagem">
        <p>{{ erro }}</p>
        <button @click="carregarServico" class="btn-tentar-novamente">Tentar Novamente</button>
        <router-link to="/listaservico" class="btn-voltar">Voltar para Lista</router-link>
      </div>

      <!-- Formulário -->
      <form v-else @submit.prevent="atualizarServico">
        <div class="form-group">
          <label for="codigo">Código</label>
          <input type="text" id="codigo" v-model="servico.codigo" disabled class="input-readonly" />
        </div>

        <div class="form-group">
          <label for="nome">Nome</label>
          <input type="text" id="nome" v-model="servico.nome" required />
        </div>

        <div class="form-group">
          <label for="descricao">Descrição</label>
          <textarea id="descricao" v-model="servico.descricao" rows="4"></textarea>
        </div>

        <div class="form-group">
          <label for="valor">Valor (R$)</label>
          <input type="number" id="valor" v-model.number="servico.valor" step="0.01" min="0" required />
        </div>

        <div class="form-group">
          <label for="tempo_medio">Tempo Médio (min)</label>
          <input type="number" id="tempo_medio" v-model="servico.tempo_medio" min="0" />
        </div>

        <div class="botoes">
          <button type="submit" class="btn-salvar" :disabled="salvando">
            {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
          <router-link to="/listaservico" class="btn-cancelar">Cancelar</router-link>
        </div>
      </form>

      <!-- Modal de sucesso -->
      <div v-if="mostrarModalSucesso" class="modal-overlay">
        <div class="modal">
          <h3>Serviço Atualizado</h3>
          <p>O serviço foi atualizado com sucesso!</p>
          <div class="modal-botoes">
            <router-link to="/listaservico" class="botao-confirmar">Voltar para Lista</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditarServico',
  data() {
    return {
      servico: {
        codigo: '',
        nome: '',
        descricao: '',
        valor: 0,
        tempo_medio: 0
      },
      carregando: true,
      salvando: false,
      erro: null,
      mostrarModalSucesso: false,
      apiBaseUrl: 'http://localhost:3000/api'
    };
  },
  computed: {
    servicoId() {
      // ✅ Corrigido: acessa query parameter em vez de route parameter
      return this.$route.query.id;
    }
  },
  mounted() {
    this.carregarServico();
  },
  methods: {
   // No EditarServico.vue, altere o método carregarServico()
async carregarServico() {
  try {
    console.log(`Buscando serviço ID: ${this.servicoId}`);
    
    // Use a rota que funciona para listar todos e filtrar
    const response = await axios.get(`${this.apiBaseUrl}/servico`);
    const servicos = response.data;
    
    // Encontrar o serviço específico
    const servicoEncontrado = servicos.find(s => s._id === this.servicoId);
    
    if (!servicoEncontrado) {
      this.erro = 'Serviço não encontrado';
      return;
    }
    
    this.servico = servicoEncontrado;
    console.log('Serviço carregado:', this.servico);
    
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    this.erro = 'Erro ao carregar dados do serviço';
  } finally {
    this.carregando = false;
  }
},

    async atualizarServico() {
  this.salvando = true;
  this.erro = null;

  try {
    console.log(`💾 Salvando serviço ${this.servicoId}:`, this.servico);

    // Use apenas a rota /api/editarservico/:id
    const response = await axios.put(`${this.apiBaseUrl}/editarservico/${this.servicoId}`, this.servico);
    console.log('✅ Serviço salvo com sucesso:', response.data);

    this.mostrarModalSucesso = true;
  } catch (error) {
    console.error('❌ Erro ao salvar serviço:', error);

    if (error.response) {
      this.erro = `Erro ${error.response.status}: ${error.response.data?.erro || error.response.data?.message || 'Não foi possível salvar o serviço'}`;
    } else if (error.request) {
      this.erro = 'Servidor não respondeu à solicitação. Verifique sua conexão.';
    } else {
      this.erro = `Erro na requisição: ${error.message}`;
    }
  }

  this.salvando = false;
}
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.form-card {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

input,
textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.input-readonly {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.botoes {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-salvar, .btn-cancelar, .btn-tentar-novamente, .btn-voltar {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  transition: all 0.3s ease;
}

.btn-salvar {
  background: #14b866;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: inline-block;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
  min-width: 150px;
  position: relative;
}

.btn-salvar:hover:not(:disabled) {
  background: #119955;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-salvar:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: none;
}

.btn-salvar:disabled {
  background: #cccccc;
  cursor: not-allowed;
  opacity: 0.8;
}

.btn-cancelar {
  background: #f44336;;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: inline-block;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
  min-width: 150px;
  position: relative;
}

.btn-cancelar:hover:not(:disabled) {
  background-color: #f44336;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


.btn-cancelar:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: none;
}

.btn-cancelar:disabled {
  background: #cccccc;
  cursor: not-allowed;
  opacity: 0.8;
}

.btn-tentar-novamente {
  background: #2196F3;
  color: white;
  margin-right: 10px;
}

.btn-voltar {
  background: #607D8B;
  color: white;
}

.erro-mensagem {
  background-color: #ffebee;
  color: #d32f2f;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #ffcdd2;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
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
  text-align: center;
}

.modal h3 {
  margin-top: 0;
  color: #14b866;
}

.modal p {
  margin: 20px 0;
}

.modal-botoes {
  display: flex;
  justify-content: center;
}

.botao-confirmar {
  background: #14b866;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
}
</style>
