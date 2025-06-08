<template>
  <div class="pagina">
    <div class="cabecalho">
      <h1>Gestão de Ordem de Serviço</h1>
      <router-link to="/novaos" class="botao-novo">+ Nova Ordem</router-link>
    </div>

    <!-- Abas de Status -->
    <div class="abas-status">
      <button
        v-for="status in statuses"
        :key="status.key"
        :class="['aba', { ativo: currentStatus === status.key }]"
        @click="currentStatus = status.key"
      >
        {{ status.label }}
      </button>
    </div>

    <div class="search-container">
      <input type="text" v-model="busca" placeholder="🔍 Pesquisar" class="search" />
    </div>

    <table class="tabela">
      <thead>
        <tr>
          <th>Número OS</th>
          <th>Cliente</th>
          <th>Data</th>
          <th>Status</th>
          <th>Valor Total</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pedido in pedidosPaginados" :key="pedido._id">
          <td>{{ pedido.numeroOS }}</td>
          <td>{{ pedido.cliente }}</td>
          <td>{{ formatarData(pedido.criadoEm || pedido.dataEntrada) }}</td>
          <td>
            <span :class="'status ' + (pedido.status || 'pendente').toLowerCase().replace(' ', '-')">
              {{ pedido.status || 'Pendente' }}
            </span>
          </td>
          <td class="valor-total-cell">R$ {{ (pedido.valorTotal || pedido.valor || 0).toFixed(2) }}</td>
          <td class="acoes">
            <router-link :to="{ name: 'EditarNovaOS', params: { id: pedido._id } }" class="botao-editar">Editar</router-link>
            <button @click="confirmarExclusao(pedido)" class="botao-excluir">Excluir</button>
            <button @click="irParaPagamento(pedido)" class="botao-pagamento">Pagamento</button>
          </td>
        </tr>
        <tr v-if="pedidosFiltrados.length === 0">
          <td colspan="6" class="sem-resultados">Nenhuma ordem encontrada</td>
        </tr>
      </tbody>
    </table>

    <div class="paginacao">
      <button @click="paginaAtual--" :disabled="paginaAtual === 1">‹</button>
      <button
        v-for="pagina in totalPaginas"
        :key="pagina"
        @click="paginaAtual = pagina"
        :class="{ ativo: paginaAtual === pagina }"
      >
        {{ pagina }}
      </button>
      <button @click="paginaAtual++" :disabled="paginaAtual === totalPaginas">›</button>
    </div>

    <div class="resumo-status">
      <div
        v-for="status in statuses.filter(s => s.key !== 'todos')"
        :key="status.key"
        class="card-status"
      >
        <div class="info">
          <div class="label">{{ status.label }}</div>
          <div class="quantidade">
            {{ contarPorStatus(status.key) }}
          </div>
        </div>
        <div :class="['icone', status.key]"></div>
      </div>
    </div>

    <!-- Modal de confirmação -->
    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal">
        <h3>Confirmar Exclusão</h3>
        <p>Tem certeza que deseja excluir a ordem de {{ pedidoParaExcluir?.cliente }}?</p>
        <div class="modal-botoes">
          <button @click="cancelarExclusao" class="botao-cancelar">Cancelar</button>
          <button @click="confirmarExclusaoFinal" class="botao-confirmar">Confirmar</button>
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
      numeroOS: '',
      pedidos: [],
      busca: '',
      paginaAtual: 1,
      itensPorPagina: 5,
      mostrarModal: false,
      pedidoParaExcluir: null,
      statuses: [
        { key: 'todos', label: 'Todos' },
        { key: 'pendente', label: 'Pendente' },
        { key: 'em-progresso', label: 'Em Progresso' },
        { key: 'completo', label: 'Completo' }
      ],
      currentStatus: 'todos'
    };
  },
  computed: {
    pedidosFiltrados() {
  let filtrados = this.pedidos;

  // ✅ Filtro por status
  if (this.currentStatus !== 'todos') {
    filtrados = filtrados.filter(p => p.status === this.currentStatus);
  }

  // ✅ Filtro por texto
  if (this.busca.trim() !== '') {
    const termo = this.busca.trim().toLowerCase();
    filtrados = filtrados.filter(p =>
      p.cliente?.toLowerCase().includes(termo) ||
      (p.descricao || '').toLowerCase().includes(termo) ||
      (p.defeito || '').toLowerCase().includes(termo) ||
      this.exibirNumeroOS(p).toLowerCase().includes(termo)
    );
  }

  return filtrados;
},
    totalPaginas() {
      return Math.max(1, Math.ceil(this.pedidosFiltrados.length / this.itensPorPagina));
    },
    pedidosPaginados() {
      const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
      return this.pedidosFiltrados.slice(inicio, inicio + this.itensPorPagina);
    }
  },
  created() {
    this.carregarOrdens();
  },
  methods: {
    async carregarOrdens() {
  try {
    let pedidosData = [];

    // Buscar pedidos
    try {
      const responsePedido = await axios.get('http://localhost:3000/api/pedido');
      pedidosData = responsePedido.data;
    } catch (err) {
      console.log('Erro /api/pedido:', err.message);
    }

    // Buscar ordens de novaos
    try {
      const responseNovaOS = await axios.get('http://localhost:3000/api/novaos');
      pedidosData = [...pedidosData, ...responseNovaOS.data];
    } catch (err) {
      console.log('Erro /api/novaos:', err.message);
    }

    // ✅ Normaliza os status
    pedidosData = pedidosData.map(p => {
      const status = (p.status || 'pendente').toLowerCase();
      return {
        ...p,
        status:
          status === 'em andamento' ? 'em-progresso' :
          status === 'completo' ? 'completo' :
          status === 'pendente' ? 'pendente' : 'pendente'
      };
    });

    this.pedidos = pedidosData;
  } catch (error) {
    console.error('Erro geral ao carregar ordens:', error);
  }
},
    formatarData(data) {
      if (!data) return 'N/A';
      const d = new Date(data);
      return d.toLocaleDateString('pt-BR');
    },
    contarPorStatus(status) {
  return this.pedidos.filter(p => p.status === status).length;
},
    confirmarExclusao(pedido) {
      this.pedidoParaExcluir = pedido;
      this.mostrarModal = true;
    },
    cancelarExclusao() {
      this.pedidoParaExcluir = null;
      this.mostrarModal = false;
    },
    async confirmarExclusaoFinal() {
      if (!this.pedidoParaExcluir) return;
      try {
        const id = this.pedidoParaExcluir._id;
        try {
          await axios.delete(`http://localhost:3000/api/novaos/${id}`);
          this.carregarOrdens();
          this.cancelarExclusao();
          alert('Ordem excluída com sucesso!');
          return;
        } catch (err) {
          console.log('Erro /api/novaos:', err.message);
        }
        try {
          await axios.delete(`http://localhost:3000/api/pedido/${id}`);
          this.carregarOrdens();
          this.cancelarExclusao();
          alert('Ordem excluída com sucesso!');
        } catch (err) {
          console.error('Erro /api/pedido:', err.message);
          throw new Error('Falha ao excluir');
        }
      } catch (error) {
        alert(`Erro: ${error.message}`);
      }
    },
    irParaPagamento(pedido) {
      this.$router.push({
        name: 'Financeiro',
        query: {
          cliente: pedido.cliente,
          servicoPrestado: pedido.equipamento || '',
          maoDeObra: 0,
          pecas: 0,
          valorTotal: pedido.valorTotal || pedido.valor || 0,
          formaPagamento: pedido.formaPagamento || '',
          pedidoId: pedido._id
        }
      });
    }
  }
};
</script>

<style scoped>
.pagina {
  max-width: 1200px;
  margin: auto;
  padding: 30px 20px;
  font-family: Arial, sans-serif;
  color: #333;
  position: relative;
}

.cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

h1 {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.botao-novo {
  background: #14b866;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
}

.abas-status {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.aba {
  padding: 8px 16px;
  border-radius: 6px;
  background: #ecf0f1;
  cursor: pointer;
  font-weight: bold;
  border: none;
  color: #7f8c8d;
}

.aba.ativo {
  background: #3498db;
  color: white;
}

.search-container {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.search {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: none;
  background: transparent;
  outline: none;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background: white;
}

.tabela th, .tabela td {
  text-align: left;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
}

.tabela th {
  background: #f8f9fa;
  font-weight: 600;
  color: #555;
}

.status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
  display: inline-block;
}

.status.completo {
  background-color: #d1f2e5;
  color: #27ae60;
}

.status.pendente {
  background-color: #d6eaf8;
  color: #2980b9;
}

.status.em-progresso {
  background-color: #fdebd0;
  color: #e67e22;
}

.acoes {
  display: flex;
  gap: 8px;
}

.botao-editar {
  background-color: #e1f0ff;
  color: #1a73e8;
  border: 1px solid #d2e3fc;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.botao-editar:hover {
  background-color: #d2e3fc;
}

.botao-excluir {
  background-color: #ffebee;
  color: #d32f2f;
  border: 1px solid #ffcdd2;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.botao-excluir:hover {
  background-color: #ffcdd2;
}

.paginacao {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.paginacao button {
  background: none;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
}

.paginacao .ativo {
  background: #f1f1dc;
  border-radius: 50%;
}

.resumo-status {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.card-status {
  background: white;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #eee;
}

.card-status .label {
  font-size: 14px;
  color: #7f8c8d;
}

.card-status .quantidade {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.icone {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.icone.completo {
  background: #27ae60;
}

.icone.pendente {
  background: #2980b9;
}

.icone.em-progresso {
  background: #e67e22;
}

.sem-resultados {
  text-align: center;
  color: #888;
  padding: 20px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}

.modal h3 {
  margin-top: 0;
  color: #2c3e50;
}

.modal p {
  margin: 20px 0;
}

.modal-botoes {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.botao-cancelar {
  background: #ecf0f1;
  color: #7f8c8d;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.botao-cancelar:hover {
  background: #d5dbdb;
}

.botao-confirmar {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.botao-confirmar:hover {
  background: #c0392b;
}

.valor-total-cell {
  font-weight: bold;
  color: #14b866;
}

.botao-pagamento {
  background-color: #14b866;
  color: white;
  border: 1px solid #13a35c;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.botao-pagamento:hover {
  background-color: #13a35c;
}
</style>
