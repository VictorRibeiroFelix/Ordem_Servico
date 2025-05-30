<template>
  <div class="container">
    <div class="recibo-card">
      <h2>Recibo de Pagamento</h2>
      <div class="info">
        <p><strong>Nome do Cliente:</strong> {{ recibo.nomeCliente }}</p>
        <p><strong>Serviço Prestado:</strong> {{ recibo.servico }}</p>
        <p><strong>Valor Pago:</strong> R$ {{ recibo.valor.toFixed(2) }}</p>
        <p><strong>Forma de Pagamento:</strong> {{ recibo.formaPagamento }}</p>
        <p><strong>Data:</strong> {{ recibo.data }}</p>
      </div>
      <div class="actions">
        <button @click="salvarRecibo" class="btn-salvar">Salvar Recibo</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ReciboView',
  data() {
    return {
      recibo: {
        nomeCliente: 'João da Silva',
        servico: 'Reparo na placa-mãe',
        valor: 250.00,
        formaPagamento: 'PIX',
        data: new Date().toLocaleDateString()
      }
    };
  },
  methods: {
    async salvarRecibo() {
      try {
        const response = await axios.post('http://localhost:3000/api/recibo', this.recibo);
        alert('Recibo salvo com sucesso!');
        console.log('Resposta da API:', response.data);
        this.$router.push('/financeiro'); // redireciona após salvar
      } catch (error) {
        console.error('Erro ao salvar recibo:', error);
        alert('Erro ao salvar recibo.');
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

.recibo-card {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}

h2 {
  margin-bottom: 1.5rem;
}

.info p {
  margin-bottom: 0.8rem;
}

.actions {
  margin-top: 2rem;
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
