<template>
  <div class="container">
    <div class="form-card">
      <h2>{{ editando ? 'Editar Cliente' : 'Cadastro de Cliente' }}</h2>

      <form @submit.prevent="salvarCliente">
        <div class="form-group">
          <label for="nome">Nome Completo</label>
          <input type="text" id="nome" v-model="cliente.nome" required placeholder="Digite o nome completo" />
        </div>

        <div class="form-group">
          <label for="cpfCnpj">CPF/CNPJ</label>
          <input type="text" id="cpfCnpj" v-model="cliente.cpfCnpj" placeholder="Ex: 123.456.789-00 ou 12.345.678/0001-99" />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="cliente.email" placeholder="cliente@email.com" />
        </div>

        <div class="form-group">
          <label for="telefone">Telefone</label>
          <input type="tel" id="telefone" v-model="cliente.telefone" placeholder="(99) 99999-9999" />
        </div>

        <div class="form-group">
          <label for="endereco">Endereço</label>
          <textarea id="endereco" v-model="cliente.endereco" placeholder="Rua, Número, Bairro, Cidade, Estado"></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-salvar">
            {{ editando ? 'Atualizar Cliente' : 'Cadastrar Cliente' }}
          </button>
          <button type="button" class="btn-cancelar" @click="cancelar">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CadastroCliente',
  props: ['clienteEditado', 'editando'],
  data() {
    return {
      cliente: {
        nome: '',
        cpfCnpj: '',
        email: '',
        telefone: '',
        endereco: ''
      }
    };
  },
  watch: {
    clienteEditado: {
      immediate: true,
      handler(novo) {
        this.cliente = novo
          ? { ...novo }
          : {
              nome: '',
              cpfCnpj: '',
              email: '',
              telefone: '',
              endereco: ''
            };
      }
    }
  },
  methods: {
    async salvarCliente() {
      try {
        if (this.editando) {
          await axios.put(`http://localhost:3000/api/cliente/${this.cliente._id}`, this.cliente);
          alert('Cliente atualizado com sucesso!');
        } else {
          await axios.post('http://localhost:3000/api/cliente', this.cliente);
          alert('Cliente cadastrado com sucesso!');
        }
        this.$emit('atualizar');
        this.$emit('limpar');
      } catch (error) {
        alert('Erro ao salvar cliente.');
        console.error(error);
      }
    },
    cancelar() {
      this.$router.push('/listacliente');
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.form-card {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.05);
}

h2 {
  margin-bottom: 1.5rem;
  font-size: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 1.3rem;
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
  box-shadow: 0 0 0 2px rgba(20, 184, 102, 0.15);
}

textarea {
  resize: vertical;
  min-height: 90px;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  gap: 15px;
}

.btn-salvar,
.btn-cancelar {
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  min-width: 160px;
  transition: all 0.3s ease;
}

.btn-salvar {
  background: #14b866;
  color: white;
}

.btn-salvar:hover {
  background: #119955;
  transform: translateY(-2px);
}

.btn-cancelar {
  background: #f44336;
  color: white;
}

.btn-cancelar:hover {
  background: #d32f2f;
  transform: translateY(-2px);
}
</style>
