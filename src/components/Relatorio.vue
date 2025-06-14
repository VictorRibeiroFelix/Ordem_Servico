<template>
  <div class="pagina-relatorio">
    <aside class="sidebar">
      <ul class="menu">
        <li><router-link to="/">📊 Painel</router-link></li>
        <li><router-link to="/estoque">📦 Estoque</router-link></li>
        <li><router-link to="/listacliente">👥 Clientes</router-link></li>
        <li><router-link to="/listaservico">🛠️ Serviços</router-link></li>
        <li><router-link to="/listafuncionario">🧰 Técnicos</router-link></li>
        <li class="active"><router-link to="/relatorio">📈 Relatórios</router-link></li>
      </ul>
    </aside>

    <div class="relatorio-container">
      <h1>📄 Relatório de Ordens de Serviço</h1>

      <div class="filtros">
        <input v-model="filtroCliente" placeholder="🔍 Cliente" />
        <select v-model="filtroStatus">
          <option value="">Todos os status</option>
          <option value="Pendente">Pendente</option>
          <option value="Em Progresso">Em Progresso</option>
          <option value="Completo">Completo</option>
        </select>
        <button @click="exportarCSV">⬇️ Exportar CSV</button>
      </div>

      <table class="tabela-os">
        <thead>
          <tr>
            <th>Número</th>
            <th>Cliente</th>
            <th>Status</th>
            <th>Data</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ordem in ordensFiltradasPaginadas" :key="ordem._id">
            <td>{{ ordem.numeroOS || 'N/A' }}</td>
            <td>{{ ordem.cliente || 'N/A' }}</td>
            <td>{{ ordem.status || 'Pendente' }}</td>
            <td>{{ formatarData(ordem.criadoEm) }}</td>
            <td>R$ {{ parseFloat(ordem.valorTotal || 0).toFixed(2) }}</td>
          </tr>
          <tr v-if="ordensFiltradas.length === 0">
            <td colspan="5" class="sem-resultados">Nenhum resultado encontrado</td>
          </tr>
        </tbody>
      </table>

      <div class="paginacao">
  <button @click="pagina--" :disabled="pagina === 1">‹</button>
  
  <button
    v-for="p in totalPaginas"
    :key="p"
    @click="pagina = p"
    :class="{ ativo: pagina === p }"
  >
    {{ p }}
  </button>

  <button @click="pagina++" :disabled="pagina === totalPaginas">›</button>
</div>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'RelatorioOrdemServico',
  data() {
    return {
      ordens: [],
      filtroCliente: "",
      filtroStatus: "",
      pagina: 1,
      porPagina: 10
    };
  },
  computed: {
  ordensFiltradas() {
    return this.ordens.filter(ordem => {
      const cliente = ordem.cliente?.toLowerCase() || "";
      const clienteOK = cliente.includes(this.filtroCliente.toLowerCase());

      const status = (ordem.status || "Pendente").toLowerCase();
      const filtro = this.filtroStatus.toLowerCase();
      const statusOK = !filtro || status === filtro;

      return clienteOK && statusOK;
    });
  },
  totalPaginas() {
    return Math.ceil(this.ordensFiltradas.length / this.porPagina);
  },
  ordensFiltradasPaginadas() {
    const start = (this.pagina - 1) * this.porPagina;
    return this.ordensFiltradas.slice(start, start + this.porPagina);
  }
},

  methods: {
    async carregarOrdens() {
      try {
        const response = await axios.get("http://localhost:3000/api/novaos");
        this.ordens = response.data;
      } catch (err) {
        console.error("Erro ao carregar ordens:", err);
        alert("Erro ao carregar ordens de serviço");
      }
    },
    formatarData(data) {
      if (!data) return "";
      return new Date(data).toLocaleDateString("pt-BR");
    },
    exportarCSV() {
      const linhas = [
        ["Número", "Cliente", "Status", "Serviço", "Data", "Valor Total"],
        ...this.ordensFiltradas.map(o => [
          o.numeroOS,
          o.cliente,
          o.status,
          typeof o.tipoServico === "object" ? o.tipoServico?.nome : o.tipoServico || "",
          this.formatarData(o.criadoEm),
          parseFloat(o.valorTotal || 0).toFixed(2)
        ])
      ];
      const csv = linhas.map(l => l.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "relatorio_os.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  created() {
    this.carregarOrdens();
  }
};
</script>

<style scoped>
.pagina-relatorio {
  display: flex;
  font-family: Arial;
}

.sidebar {
  width: 130px;
  background-color: #fff;
  padding: 20px;
  border-right: 1px solid #eee;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  margin-bottom: 16px;
}

.menu li a {
  text-decoration: none;
  color: #444;
  font-weight: 500;
}

.menu li.active a {
  background-color: #f6f4ea;
  padding: 8px 12px;
  border-radius: 8px;
  display: block;
}

.relatorio-container {
  flex-grow: 1;
  padding: 40px 60px;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.filtros {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.filtros input,
.filtros select {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.tabela-os {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.tabela-os th,
.tabela-os td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  text-align: left;
  font-size: 14px;
}

.tabela-os th {
  background: #f5f5f5;
  font-weight: bold;
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

.paginacao button.ativo {
  background: #14b866;
  color: white;
  font-weight: bold;
  border-radius: 5px;
}


button {
  padding: 6px 12px;
  border-radius: 5px;
  background: #14b866;
  color: white;
  border: none;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.sem-resultados {
  text-align: center;
  color: #888;
  padding: 20px;
  font-style: italic;
}
</style>
