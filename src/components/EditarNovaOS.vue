<template>
  <div class="nova-os-container">
    <div class="form-section">
      <h2>Editar Ordem de Serviço</h2>
      <form @submit.prevent="atualizarOS">
        <div class="form-group">
          <label for="titulo">Título do pedido</label>
          <input id="titulo" v-model="ordemServico.titulo" required />
        </div>

        <div class="form-group">
          <label for="cliente">Cliente</label>
          <select id="cliente" v-model="ordemServico.cliente">
            <option disabled value="">Selecionar</option>
            <option>Empresa A</option>
            <option>Empresa B</option>
            <option>Empresa C</option>
          </select>
        </div>

        <div class="form-group">
          <label for="tecnico">Técnico Designado</label>
          <select id="tecnico" v-model="ordemServico.tecnico">
            <option disabled value="">Selecionar</option>
            <option>João</option>
            <option>Maria</option>
            <option>Carlos</option>
          </select>
        </div>

        <div class="form-group">
          <label for="descricao">Descrição do serviço</label>
          <textarea id="descricao" v-model="ordemServico.descricao" rows="4"></textarea>
        </div>

        <div class="form-group">
          <label for="prioridade">Prioridade</label>
          <select id="prioridade" v-model="ordemServico.prioridade">
            <option disabled value="">Selecionar</option>
            <option>Baixa</option>
            <option>Média</option>
            <option>Alta</option>
          </select>
        </div>

        <div class="form-group">
          <label for="status">Status do pedido</label>
          <select id="status" v-model="ordemServico.status">
            <option disabled value="">Selecionar</option>
            <option>Aberto</option>
            <option>Em andamento</option>
            <option>Finalizado</option>
          </select>
        </div>

        <div class="form-group">
          <label for="notas">Notas</label>
          <textarea id="notas" v-model="ordemServico.notas" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label>Arquivos</label>
          <input type="file" @change="handleFileUpload" />
          <p v-if="ordemServico.arquivo">Arquivo atual: {{ ordemServico.arquivo.name || 'Já existente' }}</p>
        </div>
        <button type="submit" class="btn-salvar">Salvar Alterações</button>
      </form>
    </div>

    <div class="resumo-section">
      <h3>Resumo do pedido</h3>
      <ul>
        <li><strong>Data de criação:</strong> {{ ordemServico.dataCriacao }}</li>
        <li><strong>Nº OS:</strong> #{{ ordemServico.numero }}</li>
        <li><strong>Cliente:</strong> {{ ordemServico.cliente }}</li>
        <li><strong>Status:</strong> {{ ordemServico.status }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditarOSView',
  data() {
    return {
      ordemServico: {
        titulo: '',
        cliente: '',
        tecnico: '',
        descricao: '',
        prioridade: '',
        status: '',
        notas: '',
        arquivo: null,
        dataCriacao: '',
        numero: ''
      }
    };
  },
  mounted() {
    this.buscarOrdemServico();
  },
  methods: {
    async buscarOrdemServico() {
      const id = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:3000/api/pedido/${id}`);
        this.ordemServico = response.data;
      } catch (error) {
        console.error('Erro ao buscar OS:', error);
      }
    },
    async atualizarOS() {
      const id = this.$route.params.id;
      try {
        await axios.put(`http://localhost:3000/api/editarnovaos/${id}`, this.ordemServico);
        alert('Ordem de Serviço atualizada com sucesso!');
        this.$router.push('/pedidos');
      } catch (error) {
        console.error('Erro ao atualizar OS:', error);
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.ordemServico.arquivo = file.name || file;
    }
  }
};
</script>


<style scoped>
.nova-os-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  max-width: 1100px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
}

.form-section {
  flex: 1;
  min-width: 600px;
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.resumo-section {
  width: 250px;
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1.3rem;
}

label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.65rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

textarea {
  resize: vertical;
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

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 0.8rem;
}
</style>
