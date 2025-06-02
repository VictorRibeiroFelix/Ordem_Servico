<template>
  <div class="form-container">
    <div class="topo">
      <h1>{{ editando ? 'Editar Serviço' : 'Cadastro de Serviço' }}</h1>
    </div>

    <!-- Loading -->
    <div v-if="salvando" class="loading">
      <p>{{ editando ? 'Atualizando serviço...' : 'Salvando serviço...' }}</p>
    </div>

    <!-- Erro -->
    <div v-if="erro" class="erro-mensagem">
      <p>{{ erro }}</p>
      <button @click="erro = null" class="btn-fechar-erro">Fechar</button>
    </div>

    <form class="formulario" @submit.prevent="salvarServico" v-if="!salvando">
      <div class="form-group">
        <label for="codigo">Código *</label>
        <input 
          id="codigo" 
          v-model="servico.codigo" 
          type="text" 
          required 
          :readonly="editando"
          :class="{ 'input-readonly': editando }"
        />
        <small v-if="editando">O código não pode ser alterado durante a edição</small>
      </div>

      <div class="form-group">
        <label for="nome">Nome do Serviço *</label>
        <input id="nome" v-model="servico.nome" type="text" required />
      </div>

      <div class="form-group">
        <label for="descricao">Descrição</label>
        <textarea id="descricao" v-model="servico.descricao" rows="3" placeholder="Descreva o serviço..."></textarea>
      </div>

      <div class="form-group">
        <label for="valor">Valor (R$) *</label>
        <input id="valor" v-model.number="servico.valor" type="number" step="0.01" min="0" required />
      </div>

      <div class="form-group">
        <label for="tempo_medio">Tempo Médio (minutos) *</label>
        <input id="tempo_medio" v-model.number="servico.tempo_medio" type="number" min="0" required />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-salvar" :disabled="salvando">
          {{ editando ? 'Atualizar Serviço' : 'Salvar Serviço' }}
        </button>
        <router-link to="/listaservico" class="btn-cancelar">Cancelar</router-link>
      </div>
    </form>

    <!-- Modal de sucesso -->
    <div v-if="mostrarModalSucesso" class="modal-overlay">
      <div class="modal">
        <h3>✅ Sucesso!</h3>
        <p>{{ editando ? 'Serviço atualizado' : 'Serviço cadastrado' }} com sucesso!</p>
        <div class="modal-botoes">
          <button @click="fecharModalSucesso" class="botao-confirmar">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CadastroServico',
  props: {
    editando: Boolean,
    servicoEditado: Object
  },
  data() {
    return {
      servico: {
        codigo: '',
        nome: '',
        descricao: '',
        valor: 0,
        tempo_medio: 0
      },
      salvando: false,
      erro: null,
      mostrarModalSucesso: false
    };
  },
  
  watch: {
    servicoEditado: {
      immediate: true,
      handler(novo) {
        if (novo) {
          this.servico = { ...novo };
        } else {
          this.servico = {
            codigo: '',
            nome: '',
            descricao: '',
            valor: 0,
            tempo_medio: 0
          };
        }
      }
    }
  },
  
  methods: {
    async salvarServico() {
      try {
        this.salvando = true;
        this.erro = null;
        
        // Validações
        if (!this.servico.codigo || !this.servico.nome) {
          this.erro = 'Código e nome são obrigatórios';
          return;
        }
        
        if (this.servico.valor < 0 || this.servico.tempo_medio < 0) {
          this.erro = 'Valor e tempo médio devem ser positivos';
          return;
        }
        
        console.log('💾 Salvando serviço:', this.servico);
        
        if (this.editando) {
          // Atualizar serviço existente
          await axios.put(`http://localhost:3000/api/servico/${this.servico._id}`, this.servico);
          console.log('✅ Serviço atualizado');
        } else {
          // Criar novo serviço
          await axios.post('http://localhost:3000/api/servico', this.servico);
          console.log('✅ Serviço criado');
          this.$router.push('/listaservico');
        }

        this.mostrarModalSucesso = true;
        
      } catch (error) {
        console.error('❌ Erro ao salvar serviço:', error);
        
        if (error.response?.status === 400) {
          this.erro = error.response.data.message || 'Dados inválidos';
        } else {
          this.erro = `Erro ao salvar serviço: ${error.response?.data?.message || error.message}`;
        }
      } finally {
        this.salvando = false;
      }
    },
    
    fecharModalSucesso() {
      this.mostrarModalSucesso = false;
      this.$emit('atualizar'); // Notifica o pai para recarregar os dados
    }
  }
};
</script>

<style scoped>
.form-container {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  max-width: 800px;
  margin: 0 auto;
}

.topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

h1 {
  font-size: 26px;
  margin: 0;
  color: #333;
}

.btn-voltar {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-voltar:hover {
  background: #5a6268;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

.erro-mensagem {
  background-color: #ffebee;
  color: #d32f2f;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #ffcdd2;
}

.btn-fechar-erro {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #444;
}

input,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #14b866;
  box-shadow: 0 0 0 2px rgba(20, 184, 102, 0.1);
}

.input-readonly {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

small {
  color: #666;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
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
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal h3 {
  margin-top: 0;
  color: #14b866;
  margin-bottom: 15px;
}

.modal p {
  margin: 15px 0;
  color: #555;
}

.modal-botoes {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}

.botao-confirmar {
  background: #14b866;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
</style>
