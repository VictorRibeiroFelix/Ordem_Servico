<template>
  <div class="estoque-layout">
    <div class="estoque-container">
      <div class="topo">
        <h1>Nova ordem de serviço</h1>
      </div>

      <div class="form-container">
        <!-- DADOS DO CLIENTE -->
        <div class="form-section">
          <h2>Dados do Cliente</h2>

          <div class="form-group">
            <label>Nome do Cliente</label>
            <input type="text" class="form-input" v-model="cliente" style="width: 70%" />
          </div>

          <div class="form-group">
            <label>Telefone</label>
            <input type="text" class="form-input" v-model="telefone" style="width: 70%" />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-input" v-model="email" style="width: 70%" />
          </div>

          <div class="form-group">
            <label>Endereço</label>
            <input type="text" class="form-input" v-model="endereco" style="width: 70%" />
          </div>

          <div class="form-group">
            <label>CEP</label>
            <input type="text" class="form-input" v-model="cep" style="width: 70%" />
          </div>

          <div class="form-group">
            <label>Estado</label>
            <input type="text" class="form-input" v-model="estado" style="width: 70%" />
          </div>

          <div class="form-group">
            <label>Descrição do problema</label>
            <textarea class="form-textarea" v-model="descricao" style="width: 70%"></textarea>
          </div>
        </div>

        <!-- TIPO DE SERVIÇO -->
        <div class="form-section">
          <h2>Tipo de serviço</h2>
          <div class="form-group">
            <select class="form-input" v-model="tipoServico" style="width: 70%">
              <option value="">Selecione o tipo de serviço</option>
              <option value="Escrita/serviço">Escrita/serviço</option>
              <option value="Produto">Produto</option>
              <option value="Relocismo produto">Relocismo produto</option>
            </select>
          </div>
        </div>

        <!-- PEÇA NECESSÁRIA -->
        <div class="form-section">
          <h2>Peça necessária</h2>
          <div class="form-group">
            <select class="form-input" v-model="pecaNecessaria" style="width: 70%">
              <option value="">Selecione a peça necessária</option>
              <option value="Lista da percentaria/solda">Lista da percentaria/solda</option>
              <option value="Outra peça">Outra peça</option>
            </select>
          </div>
        </div>

        <!-- TÉCNICO -->
        <div class="form-section">
          <h2>Técnico</h2>
          <div class="form-group">
            <select class="form-input" v-model="tecnico" style="width: 70%">
              <option value="">Selecione o técnico</option>
              <option value="Técnico 1">Técnico 1</option>
              <option value="Técnico 2">Técnico 2</option>
            </select>
          </div>
        </div>

        <!-- BOTÃO SALVAR -->
        <div class="form-actions">
          <button class="botao-salvar" @click="salvarOrdemServico">Salvar Ordem</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'NovaOrdemServico',
  data() {
    return {
      cliente: '',
      telefone: '',
      email: '',
      endereco: '',
      cep: '',
      estado: '',
      descricao: '',
      tipoServico: '',
      pecaNecessaria: '',
      tecnico: ''
    };
  },
  methods: {
    async salvarOrdemServico() {
      const novaOrdem = {
        cliente: this.cliente,
        telefone: this.telefone,
        email: this.email,
        endereco: this.endereco,
        cep: this.cep,
        estado: this.estado,
        descricao: this.descricao,
        tipoServico: this.tipoServico,
        pecaNecessaria: this.pecaNecessaria,
        tecnico: this.tecnico
      };

      try {
        await axios.post('http://localhost:3000/api/novaos', novaOrdem);
        alert('Ordem de serviço salva com sucesso!');
        this.$router.push('/pedido'); // Redireciona para a tela de pedidos
      } catch (error) {
        console.error('Erro ao salvar ordem de serviço:', error);
        alert('Erro ao salvar ordem de serviço.');
      }
    }
  }
};
</script>

<style scoped>
.estoque-layout {
  max-width: 800px;
  margin: 2rem auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.estoque-container {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}

.topo {
  margin-bottom: 20px;
}

h1 {
  font-size: 28px;
  font-weight: bold;
}

.form-container {
  background: white;
  padding: 30px;
  border-radius: 12px;
}

.form-section {
  margin-bottom: 30px;
}

.form-section h2 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #444;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
}

.form-textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  min-height: 100px;
  resize: vertical;
  width: 100%;
}

.botao-salvar {
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
  text-align: center;
  min-width: 150px;
}

.botao-salvar:hover {
  background: #119955;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.botao-salvar:active {
  transform: translateY(0);
  box-shadow: none;
}

.form-actions {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
  margin-top: 30px;
}
</style>
