<template>
  <div class="pagina">
    <h2>Pagamento</h2>

    <form @submit.prevent="registrarFinanceiro" class="formulario">
      <div class="campo">
        <label>Cliente:</label>
        <input type="text" v-model="nomeCliente" readonly />
      </div>

      <div class="campo">
        <label>Valor Total (R$):</label>
        <input type="number" v-model.number="valorTotal" required />
      </div>

      <div class="campo">
        <label>Forma de Pagamento:</label>
        <select v-model="formaPagamento" required>
          <option disabled value="">Selecione</option>
          <option>Dinheiro</option>
          <option>Cartão</option>
          <option>PIX</option>
        </select>
      </div>

      <div class="botoes">
        <button type="submit">Confirmar Pagamento</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PagamentoFinanceiro',
  data() {
    return {
      nomeCliente: '',
      valorTotal: 0,
      formaPagamento: '',
      pedidoId: ''
    };
  },
  created() {
    const q = this.$route.query;
    this.nomeCliente = q.cliente || '';
    this.pedidoId = q.pedidoId || '';
    this.valorTotal = Number(q.valorTotal) || 0;
  },
  methods: {
    async registrarFinanceiro() {
  try {
    const payload = {
      nomeCliente: this.nomeCliente,
      valorTotal: this.valorTotal,
      formaPagamento: this.formaPagamento,
      // Campos com valores padrão
      servicoPrestado: 'Serviço técnico',
      maoDeObra: 0,
      pecas: 0,
      statusPagamento: 'Pago'
    };

    console.log('Enviando payload:', payload); // Adicione este log

    const response = await axios.post('http://localhost:3000/api/financeiro', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Resposta do servidor:', response.data);
    this.$router.push({ name: 'Recibo', params: { id: response.data._id } });
  } catch (err) {
    console.error('Erro detalhado:', {
      message: err.message,
      response: err.response?.data,
      stack: err.stack
    });
    alert(`Erro ao registrar pagamento: ${err.response?.data?.error || err.message}`);
  }
}
  }
};
</script>

<style scoped>
.pagina {
  max-width: 600px;
  margin: auto;
  padding: 30px 20px;
  font-family: Arial, sans-serif;
  color: #333;
}

h2 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.formulario {
  background: #f9f9f9;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.campo {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
  color: #555;
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.botoes {
  text-align: center;
  margin-top: 20px;
}

button {
  background: #14b866;
  color: white;
  border: none;
  padding: 10px 25px;
  font-size: 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:hover {
  background: #119f59;
}
</style>
