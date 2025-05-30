<template>
  <div class="container">
    <div class="financeiro-card">
      <h2>Financeiro</h2>

      <div class="form-group">
        <label for="cliente">Nome do Cliente</label>
        <input type="text" id="cliente" v-model="cliente" />
      </div>

      <div class="form-group">
        <label for="servico">Serviço Prestado</label>
        <input type="text" id="servico" v-model="servico" />
      </div>

      <div class="form-group">
        <label for="maoDeObra">Mão de Obra (R$)</label>
        <input type="number" id="maoDeObra" v-model="maoDeObra" @input="calcularTotal" />
      </div>

      <div class="form-group">
        <label for="pecas">Valor das Peças (R$)</label>
        <input type="number" id="pecas" v-model="pecas" @input="calcularTotal" />
      </div>

      <div class="form-group">
        <label for="valorTotal">Valor Total (R$)</label>
        <input type="number" id="valorTotal" :value="valorTotal.toFixed(2)" readonly />
      </div>

      <div class="form-group">
        <label for="statusPagamento">Status do Pagamento</label>
        <select id="statusPagamento" v-model="statusPagamento">
          <option>Pendente</option>
          <option>Pago</option>
        </select>
      </div>

      <div class="form-group">
        <label for="formaPagamento">Forma de Pagamento</label>
        <select id="formaPagamento" v-model="formaPagamento">
          <option>Dinheiro</option>
          <option>Cartão</option>
          <option>PIX</option>
        </select>
      </div>

      <div class="botoes">
        <button class="btn-recibo" @click="emitirRecibo">Emitir Recibo</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FinanceiroView',
  data() {
    return {
      cliente: '',
      servico: '',
      maoDeObra: 0,
      pecas: 0,
      valorTotal: 0,
      statusPagamento: 'Pendente',
      formaPagamento: 'Dinheiro',
    };
  },
  methods: {
    calcularTotal() {
      this.valorTotal = parseFloat(this.maoDeObra || 0) + parseFloat(this.pecas || 0);
    },
    async registrarPagamento() {
      try {
        const payload = {
          cliente: this.cliente,
          servico: this.servico,
          maoDeObra: this.maoDeObra,
          pecas: this.pecas,
          valorTotal: this.valorTotal,
          statusPagamento: this.statusPagamento,
          formaPagamento: this.formaPagamento,
        };

        await axios.post('http://localhost:3000/api/financeiro', payload);
        alert('Pagamento registrado com sucesso!');
        this.$router.push('/novaos');
      } catch (error) {
        console.error('Erro ao registrar pagamento:', error);
        alert('Erro ao registrar pagamento');
      }
    },
    emitirRecibo() {
      this.$router.push({
        name: 'Recibo',
        query: {
          cliente: this.cliente,
          servico: this.servico,
          maoDeObra: this.maoDeObra,
          pecas: this.pecas,
          valorTotal: this.valorTotal.toFixed(2),
          statusPagamento: this.statusPagamento,
          formaPagamento: this.formaPagamento,
        },
      });
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.financeiro-card {
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
select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.botoes {
  margin-top: 2rem;
}

.btn-recibo {
  background-color: #3b82f6;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-recibo:hover {
  background-color: #2563eb;
}
</style>
