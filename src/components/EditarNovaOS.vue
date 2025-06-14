<template>
  <div class="estoque-layout">
    <div class="estoque-container">
      <div class="topo">
        <h1>Editar Ordem de Serviço</h1>
        <div class="id-container">
          <label>Número da OS</label>
          <input type="text" class="form-input id-input" v-model="ordemServico.numeroOS" readonly />
        </div>
      </div>

      <div class="form-container">
        <!-- Cliente -->
        <div class="form-section">
          <h2>🧾 Dados do Cliente</h2>
          <div class="form-group"><label>Nome</label><input class="form-input" v-model="ordemServico.cliente" /></div>
          <div class="form-group"><label>Telefone</label><input class="form-input" v-model="ordemServico.telefone" /></div>
          <div class="form-group"><label>Email</label><input class="form-input" v-model="ordemServico.email" /></div>
          <div class="form-group"><label>Endereço</label><input class="form-input" v-model="ordemServico.endereco" /></div>
          <div class="form-group"><label>CEP</label><input class="form-input" v-model="ordemServico.cep" /></div>
          <div class="form-group"><label>Estado</label><input class="form-input" v-model="ordemServico.estado" /></div>
        </div>

        <!-- Serviço -->
        <div class="form-section">
          <h2>🛠️ Serviço</h2>
          <div class="form-group">
            <label>Serviço Selecionado</label>
           <input
  type="text"
  class="form-input"
  :value="ordemServico.tipoServico?.nome || 'Serviço não encontrado'"
  readonly
/>

          </div>
        </div>

        <!-- Peças -->
        <div class="form-section">
          <h2>📦 Peças e Observações</h2>
          <div v-if="ordemServico.produtos?.length">
  <ul>
    <li v-for="(item, i) in ordemServico.produtos" :key="i">
      {{ item.produto?.nome || 'Produto desconhecido' }} - Qtd: {{ item.quantidade }} - R$ {{ item.valor.toFixed(2) }}
    </li>
  </ul>
</div>

          <div class="form-group">
            <label>Observações / Peças adicionais</label>
            <textarea class="form-textarea" v-model="ordemServico.pecaNecessaria" />
          </div>
        </div>

        <!-- Técnicos -->
        <div class="form-section">
          <h2>👨‍🔧 Técnicos Responsáveis</h2>
          <div v-if="ordemServico.tecnicos?.length">
  <ul>
    <li v-for="(tecnico, i) in ordemServico.tecnicos" :key="i">
      {{ tecnico?.nome || 'Técnico desconhecido' }} - {{ tecnico?.funcao || '' }}
    </li>
  </ul>
</div>

          <div v-else><p>Nenhum técnico vinculado.</p></div>
        </div>

        <!-- Status -->
        <div class="form-section">
          <h2>📌 Status da OS</h2>
          <div class="form-group">
            <label>Status</label>
            <select class="form-input" v-model="ordemServico.status">
              <option value="Pendente">Pendente</option>
              <option value="Em Progresso">Em Progresso</option>
              <option value="Completo">Completo</option>
            </select>
          </div>
        </div>

        <!-- Ações -->
        <div class="form-actions">
          <button class="botao-salvar" @click="salvar"> Salvar Alterações</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      ordemServico: {}
    };
  },
  methods: {
    async carregarOrdem() {
  const id = this.$route.params.id;
  console.log('ID da OS:', id); // ✅ Adicione AQUI

  if (!id) {
    console.error('ID não encontrado');
    alert('ID da OS não foi fornecido');
    return;
  }

  try {
    const { data } = await axios.get(`http://localhost:3000/api/editarnovaos/${id}`);
    this.ordemServico = data;
  } catch (err) {
    console.error('Erro ao carregar OS:', err);
    alert('Erro ao carregar ordem de serviço. Verifique o console para detalhes.');
  }
},
    async salvar() {
      const id = this.$route.params.id;
      try {
        await axios.put(`http://localhost:3000/api/editarnovaos/${id}`, this.ordemServico);
        alert('Ordem de serviço atualizada com sucesso!');
        this.$router.push('/pedido');
      } catch (err) {
        console.error('Erro ao salvar:', err);
        alert('Erro ao salvar ordem de serviço.');
      }
    }
  },
  mounted() {
    this.carregarOrdem();
  }
};
</script>

<style scoped>
.estoque-layout {
  max-width: 900px;
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
  font-size: 18px;
  margin-bottom: 15px;
  color: #2c3e50;
  padding-bottom: 6px;
  border-bottom: 1px solid #eee;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
  color: #555;
}
.form-input,
.form-textarea,
select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
}
.form-textarea {
  min-height: 100px;
  resize: vertical;
}
.id-input {
  font-family: 'Courier New', monospace;
  background: #f4f4f4;
  border: 2px solid #007bff;
  color: #333;
  text-align: center;
  font-weight: bold;
}
.produto-lista,
.tecnico-lista {
  list-style: none;
  padding-left: 0;
  margin-bottom: 10px;
}
.produto-item {
  background: #f1f1f1;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 6px;
}
.form-actions {
  text-align: center;
  margin-top: 20px;
}
.botao-salvar {
  background: #14b866;
  color: white;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  border: none;
}
.botao-salvar:hover {
  background: #119955;
  transform: scale(1.02);
}
</style>
