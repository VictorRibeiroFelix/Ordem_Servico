<template>
  <div class="container">
    <div class="form-card">
      <h2>Editar Cliente</h2>
      
      <!-- Loading -->
      <div v-if="carregando" class="loading">
        <p>Carregando dados do cliente...</p>
      </div>
      
      <!-- Erro -->
      <div v-else-if="erro" class="erro">
        <p>{{ erro }}</p>
        <button @click="carregarCliente" class="btn-tentar">Tentar Novamente</button>
        <router-link to="/listacliente" class="btn-voltar">Voltar</router-link>
      </div>
      
      <!-- Formulário -->
      <form v-else @submit.prevent="atualizarCliente">
        <div class="form-group">
          <label for="nome">Nome</label>
          <input type="text" id="nome" v-model="cliente.nome" required />
        </div>

        <div class="form-group">
          <label for="cpfCnpj">CPF/CNPJ</label>
          <input type="text" id="cpfCnpj" v-model="cliente.cpfCnpj" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="cliente.email" />
        </div>

        <div class="form-group">
          <label for="telefone">Telefone</label>
          <input type="text" id="telefone" v-model="cliente.telefone" />
        </div>

        <div class="form-group">
          <label for="endereco">Endereço</label>
          <textarea id="endereco" v-model="cliente.endereco"></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-salvar">Salvar Alterações</button>
          <router-link to="/listacliente" class="btn-cancelar">Cancelar</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditarCliente',
  data() {
    return {
      cliente: {
        nome: '',
        cpfCnpj: '',
        email: '',
        telefone: '',
        endereco: ''
      },
      carregando: true,
      erro: null
    };
  },
  methods: {
    async carregarCliente() {
      try {
        this.carregando = true;
        this.erro = null;
        
        console.log(`Buscando cliente ID: ${this.$route.params.id}`);
        
        // SOLUÇÃO TEMPORÁRIA: Buscar todos os clientes e filtrar pelo ID
        const response = await axios.get('http://localhost:3000/api/cliente');
        const clientes = response.data;
        
        // Encontrar o cliente específico pelo ID
        const clienteEncontrado = clientes.find(c => c._id === this.$route.params.id);
        
        if (!clienteEncontrado) {
          this.erro = 'Cliente não encontrado';
          return;
        }
        
        this.cliente = clienteEncontrado;
        console.log('Cliente carregado:', this.cliente);
        
      } catch (err) {
        console.error('Erro ao buscar cliente:', err);
        this.erro = 'Erro ao carregar dados do cliente';
      } finally {
        this.carregando = false;
      }
    },
    
    async atualizarCliente() {
      try {
        // Tenta várias rotas possíveis
        let sucesso = false;
        
        // Tenta PUT /api/cliente/:id
        try {
          await axios.put(`http://localhost:3000/api/cliente/${this.$route.params.id}`, this.cliente);
          sucesso = true;
          console.log('Cliente atualizado via /api/cliente/:id');
        } catch (error) {
          console.log('Falha em /api/cliente/:id, tentando outras rotas...');
        }
        
        // Se falhou, tenta PUT /api/listacliente/:id
        if (!sucesso) {
          try {
            await axios.put(`http://localhost:3000/api/listacliente/${this.$route.params.id}`, this.cliente);
            sucesso = true;
            console.log('Cliente atualizado via /api/listacliente/:id');
          } catch (error) {
            console.log('Falha em /api/listacliente/:id');
          }
        }
        
        if (sucesso) {
          alert('Cliente atualizado com sucesso!');
          this.$router.push('/listacliente');
        } else {
          alert('Erro: Nenhuma rota de atualização disponível');
        }
        
      } catch (err) {
        alert('Erro ao atualizar cliente.');
        console.error(err);
      }
    }
  },
  mounted() {
    this.carregarCliente();
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 20px;
}
.form-card {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}
.form-group {
  margin-bottom: 1.2rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}
input, textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.btn-salvar {
  background: #14b866;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  margin-right: 10px;
}
.btn-cancelar {
  background: #f44336;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
}
</style>
