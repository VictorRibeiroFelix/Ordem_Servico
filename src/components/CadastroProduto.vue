<template>
  <div class="container">
    <div class="form-card">
      <h2>Cadastro de Produto/Peça</h2>

      <form @submit.prevent="salvarProduto">
        <div class="form-group">
          <label for="nome">Nome do Produto</label>
          <input type="text" id="nome" v-model="produto.nome" required />
        </div>

        <div class="form-group">
          <label for="codigo">Código do Produto</label>
          <input type="text" id="codigo" v-model="produto.codigo" />
        </div>

        <div class="form-group">
          <label for="categoria">Categoria</label>
          <select id="categoria" v-model="produto.categoria">
            <option value="">Selecione</option>
            <option>Elétrica</option>
            <option>Hidráulica</option>
            <option>Mecânica</option>
          </select>
        </div>

        <div class="form-group">
          <label for="quantidade">Quantidade em Estoque</label>
          <input type="number" id="quantidade" v-model="produto.quantidade" min="0" />
        </div>

        <div class="form-group">
          <label for="preco">Preço Unitário (R$)</label>
          <input type="number" id="preco" v-model="produto.preco" step="0.01" min="0" />
        </div>

        <div class="form-group">
          <label for="descricao">Descrição</label>
          <textarea id="descricao" v-model="produto.descricao"></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-salvar" :disabled="loading">
            <span v-if="!loading">Salvar Produto</span>
            <span v-else class="loading-spinner"></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CadastroProdutosView',
  data() {
    return {
      produto: {
        nome: '',
        codigo: '',
        categoria: '',
        quantidade: null,
        preco: null,
        descricao: '',
      },
      loading: false
    };
  },
  methods: {
    async salvarProduto() {
      this.loading = true;
      try {
        await axios.post('http://localhost:3000/api/produto', this.produto);
        alert('Produto cadastrado com sucesso!');
        this.$router.push('/estoque'); // Redireciona após salvar
      } catch (error) {
        console.error('Erro ao salvar produto:', error);
        alert('Erro ao salvar produto');
      } 
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
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

textarea {
  resize: vertical;
  min-height: 100px;
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

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
