<template>
  <div class="container">
    <div class="form-card">
      <h2>Cadastro de Técnico</h2>

      <form @submit.prevent="salvarFuncionario">
        <div class="form-group">
          <label for="nome">Nome</label>
          <input type="text" id="nome" v-model="funcionario.nome" required />
        </div>

        <div class="form-group">
          <label for="cpf">CPF</label>
          <input type="text" id="cpf" v-model="funcionario.cpf" />
        </div>

        <div class="form-group">
          <label for="funcao">Função</label>
          <input type="text" id="funcao" v-model="funcionario.funcao" />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="funcionario.email" />
        </div>

        <div class="form-group">
          <label for="telefone">Telefone</label>
          <input type="text" id="telefone" v-model="funcionario.telefone" />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-salvar">Salvar</button>
          <button type="button" class="btn-cancelar" @click="cancelar">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CadastroFuncionario',
  data() {
    return {
      funcionario: {
        nome: '',
        cpf: '',
        funcao: '',
        email: '',
        telefone: ''
      }
    };
  },
  methods: {
    async salvarFuncionario() {
      try {
        await axios.post('http://localhost:3000/api/funcionario', this.funcionario);
        alert('Técnico cadastrado com sucesso!');
        this.$router.push('/listafuncionario');
      } catch (error) {
        alert('Erro ao salvar técnico');
        console.error(error);
      }
    },
    cancelar() {
      this.$router.push('/listafuncionario');
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 700px;
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
input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}
.form-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 10px;
}
.btn-salvar {
  background: #14b866;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
.btn-cancelar {
  background: #f44336;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
</style>
