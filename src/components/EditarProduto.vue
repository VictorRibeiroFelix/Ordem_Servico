<template>
  <div class="container">
    <div class="form-card">
      <h2>Editar Produto/Peça</h2>

      <form @submit.prevent="atualizarProduto">
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

        <button type="submit" class="btn-salvar">Salvar Alterações</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditarProdutoView',
  data() {
    return {
      produto: {
        nome: '',
        codigo: '',
        categoria: '',
        quantidade: null,
        preco: null,
        descricao: ''
      }
    };
  },
  mounted() {
  const codigo = this.$route.query.codigo;
  axios.get(`http://localhost:3000/api/editarproduto/${codigo}`)
    .then(response => {
      this.produto = response.data;
    })
    .catch(() => {
      alert('Erro ao carregar dados do produto.');
    });
},

  atualizarProduto() {
  const codigo = this.$route.query.codigo;
  axios.put(`http://localhost:3000/api/editarproduto/${codigo}`, this.produto)
    .then(() => {
      alert('Produto atualizado com sucesso!');
      this.$router.push('/estoque');
    })
    .catch(() => {
      alert('Erro ao atualizar produto.');
    });
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
  background-color: #10b981;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-salvar:hover {
  background-color: #0e9e6e;
}
</style>
