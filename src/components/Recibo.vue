<template>
  <div class="recibo">
    <div class="recibo-conteudo" v-if="financeiro">
      <h2>Recibo de Pagamento</h2>

      <div class="linha"><strong>Cliente:</strong> {{ financeiro.nomeCliente }}</div>
      <div class="linha"><strong>Serviço:</strong> {{ financeiro.servicoPrestado }}</div>
      <div class="linha total"><strong>Valor Total:</strong> R$ {{ financeiro.valorTotal.toFixed(2) }}</div>
      <div class="linha"><strong>Forma de Pagamento:</strong> {{ financeiro.formaPagamento }}</div>
      <div class="linha"><strong>Status:</strong> {{ financeiro.statusPagamento }}</div>
      <div class="linha"><strong>Data:</strong> {{ formatarData(financeiro.data) }}</div>

      <div class="assinatura">
        ____________________________________________
        <br />
        Assinatura do Cliente
      </div>

      <button class="botao-imprimir" @click="imprimir">Imprimir</button>
    </div>
    <div v-else>
      Carregando recibo...
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ReciboPagamento',
  data() {
    return {
      financeiro: null
    };
  },
  created() {
    this.carregarRecibo();
  },
  methods: {
    async carregarRecibo() {
  const id = this.$route.params.id;
  try {
    // Use a rota correta para buscar os dados financeiros
    const response = await axios.get(`http://localhost:3000/api/financeiro/${id}`);
    this.financeiro = response.data;
  } catch (err) {
    console.error('Erro ao carregar recibo:', err);
    alert('Recibo não encontrado. Verifique o ID.');
  }
},
    formatarData(data) {
      if (!data) return 'N/A';
      const d = new Date(data);
      return d.toLocaleDateString('pt-BR');
    },
    imprimir() {
      window.print();
    }
  }
};
</script>

<style scoped>
.recibo {
  max-width: 700px;
  margin: auto;
  padding: 40px;
  border: 1px solid #ccc;
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  background: white;
}

.recibo-conteudo h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.linha {
  margin-bottom: 12px;
}

.total {
  font-size: 18px;
  font-weight: bold;
  color: #14b866;
  margin-top: 10px;
}

.assinatura {
  margin-top: 60px;
  text-align: center;
  font-style: italic;
  color: #555;
}

.botao-imprimir {
  display: block;
  margin: 40px auto 0;
  padding: 10px 25px;
  background-color: #14b866;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 15px;
  transition: 0.2s ease;
}
.botao-imprimir:hover {
  background-color: #0f9e59;
}

@media print {
  .botao-imprimir {
    display: none;
  }
  .recibo {
    border: none;
    padding: 0;
  }
}
</style>
