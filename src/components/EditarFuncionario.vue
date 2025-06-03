<template>
  <div class="container">
    <div class="form-card">
      <h2>Editar Funcionário</h2>

      <form @submit.prevent="atualizarFuncionario">
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
          <label for="email">E-mail</label>
          <input type="email" id="email" v-model="funcionario.email" />
        </div>

        <div class="form-group">
          <label for="telefone">Telefone</label>
          <input type="text" id="telefone" v-model="funcionario.telefone" />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-salvar">Salvar Alterações</button>
          <router-link to="/listafuncionario" class="btn-cancelar">Cancelar</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditarFuncionario',
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
  async mounted() {
    const id = this.$route.params.id;
    try {
      const res = await axios.get(`http://localhost:3000/api/funcionario/${id}`);
      this.funcionario = res.data;
    } catch (err) {
      console.error('Erro ao carregar funcionário:', err);
      alert('Funcionário não encontrado.');
    }
  },
  methods: {
    async atualizarFuncionario() {
      try {
        await axios.put(`http://localhost:3000/api/funcionario/${this.$route.params.id}`, this.funcionario);
        alert('Funcionário atualizado com sucesso!');
        this.$router.push('/listafuncionario');
      } catch (err) {
        console.error('Erro ao atualizar funcionário:', err);
        alert('Erro ao atualizar funcionário.');
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
  gap: 12px;
}

.btn-salvar {
  background: #14b866;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-salvar:hover {
  background: #119955;
}

.btn-cancelar {
   background: #f44336;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
}
</style>
