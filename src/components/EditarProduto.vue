<template>
  <div class="editar-produto">
    <h1>Editar Produto</h1>
    
    <div v-if="carregando" class="loading">
      <p>Carregando dados do produto...</p>
    </div>
    
    <div v-else-if="erro" class="erro-mensagem">
      <p>{{ erro }}</p>
      <button @click="tentarNovamente" class="btn-tentar-novamente">Tentar Novamente</button>
      <router-link to="/" class="btn-voltar">Voltar para Listagem</router-link>
    </div>
    
    <form v-else @submit.prevent="salvarProduto" class="formulario">
      <div class="form-group">
        <label for="codigo">Código</label>
        <input type="text" id="codigo" v-model="produto.codigo" readonly class="input-readonly" />
      </div>
      
      <div class="form-group">
        <label for="nome">Nome</label>
        <input type="text" id="nome" v-model="produto.nome" required />
      </div>
      
      <div class="form-group">
        <label for="categoria">Categoria</label>
        <input type="text" id="categoria" v-model="produto.categoria" required />
      </div>
      
      <div class="form-group">
        <label for="quantidade">Quantidade</label>
        <input type="number" id="quantidade" v-model="produto.quantidade" required min="0" />
      </div>
      
      <div class="form-group">
        <label for="preco">Preço (R$)</label>
        <input type="number" id="preco" v-model="produto.preco" required min="0" step="0.01" />
      </div>
      
      <div class="botoes">
        <button type="submit" class="btn-salvar" :disabled="salvando">
          {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
        <router-link to="/estoque" class="btn-cancelar">Cancelar</router-link>
      </div>
    </form>
    
    <!-- Modal de sucesso -->
    <div v-if="mostrarModalSucesso" class="modal-overlay">
      <div class="modal">
        <h3>Produto Atualizado</h3>
        <p>O produto foi atualizado com sucesso!</p>
        <div class="modal-botoes">
          <router-link to="/estoque" class="botao-confirmar">Voltar para Listagem</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditarProduto',
  data() {
    return {
      produto: {
        codigo: '',
        nome: '',
        categoria: '',
        quantidade: 0,
        preco: 0
      },
      carregando: true,
      salvando: false,
      erro: null,
      mostrarModalSucesso: false,
      // URL base correta para o servidor
      apiBaseUrl: 'http://localhost:3000/api'
    };
  },
  computed: {
    codigoProduto() {
      // Obtém o código do produto da URL
      return this.$route.query.codigo;
    }
  },
  methods: {
    async buscarProduto() {
      this.carregando = true;
      this.erro = null;
      
      // Verifica se o código do produto existe
      if (!this.codigoProduto) {
        this.erro = 'Código do produto não especificado na URL';
        this.carregando = false;
        return;
      }
      
      console.log(`Buscando produto com código: ${this.codigoProduto}`);
      
      // Tenta buscar o produto usando diferentes rotas
      let response = null;
      let error = null;
      
      // Tenta a rota editarproduto
      try {
        response = await axios.get(`${this.apiBaseUrl}/editarproduto/${this.codigoProduto}`);
      } catch (err) {
        console.log('Falha na rota editarproduto, tentando produto...');
        error = err;
      }
      
      // Se falhou, tenta a rota produto
      if (!response) {
        try {
          response = await axios.get(`${this.apiBaseUrl}/produto/${this.codigoProduto}`);
          error = null; // Limpa o erro se esta chamada for bem-sucedida
        } catch (err) {
          console.log('Falha na rota produto, tentando estoque...');
          error = err;
        }
      }
      
      // Se ainda falhou, tenta a rota estoque
      if (!response) {
        try {
          response = await axios.get(`${this.apiBaseUrl}/estoque/${this.codigoProduto}`);
          error = null; // Limpa o erro se esta chamada for bem-sucedida
        } catch (err) {
          console.log('Falha na rota estoque, todas as tentativas falharam');
          error = err;
        }
      }
      
      // Processa o resultado
      if (response && response.data) {
        this.produto = response.data;
        console.log('Produto carregado:', this.produto);
      } else {
        console.error('Erro ao buscar produto:', error);
        
        if (error.response) {
          this.erro = `Erro ${error.response.status}: ${error.response.data?.message || 'Não foi possível buscar os dados do produto'}`;
        } else if (error.request) {
          this.erro = 'Servidor não respondeu à solicitação. Verifique sua conexão.';
        } else {
          this.erro = `Erro na requisição: ${error.message}`;
        }
      }
      
      this.carregando = false;
    },
    
    async salvarProduto() {
      this.salvando = true;
      this.erro = null;
      
      // Atualiza a data de última atualização
      this.produto.ultimaAtualizacao = new Date();
      
      // Tenta salvar o produto usando diferentes rotas
      let response = null;
      let error = null;
      
      // Tenta a rota editarproduto
      try {
        response = await axios.put(`${this.apiBaseUrl}/editarproduto/${this.codigoProduto}`, this.produto);
      } catch (err) {
        console.log('Falha ao salvar na rota editarproduto, tentando produto...');
        error = err;
      }
      
      // Se falhou, tenta a rota produto
      if (!response) {
        try {
          response = await axios.put(`${this.apiBaseUrl}/produto/${this.codigoProduto}`, this.produto);
          error = null;
        } catch (err) {
          console.log('Falha ao salvar na rota produto, tentando estoque...');
          error = err;
        }
      }
      
      // Se ainda falhou, tenta a rota estoque
      if (!response) {
        try {
          response = await axios.put(`${this.apiBaseUrl}/estoque/${this.codigoProduto}`, this.produto);
          error = null;
        } catch (err) {
          console.log('Falha ao salvar na rota estoque, todas as tentativas falharam');
          error = err;
        }
      }
      
      // Processa o resultado
      if (response && response.data) {
        this.mostrarModalSucesso = true;
      } else {
        console.error('Erro ao salvar produto:', error);
        
        if (error.response) {
          this.erro = `Erro ${error.response.status}: ${error.response.data?.message || 'Não foi possível salvar o produto'}`;
        } else if (error.request) {
          this.erro = 'Servidor não respondeu à solicitação. Verifique sua conexão.';
        } else {
          this.erro = `Erro na requisição: ${error.message}`;
        }
      }
      
      this.salvando = false;
    },
    
    tentarNovamente() {
      this.buscarProduto();
    }
  },
  mounted() {
    // Busca o produto quando o componente é montado
    this.buscarProduto();
  }
};
</script>

<style scoped>
.editar-produto {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.formulario {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
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
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  display: inline-block;
  text-align: center;
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
  background-color: #2196F3;
  color: white;
  margin-right: 10px;
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
  color: #4CAF50;
}

.modal p {
  margin: 20px 0;
}

.modal-botoes {
  display: flex;
  justify-content: center;
}

.botao-confirmar {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
}
</style>
