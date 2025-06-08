<template>
  <div class="estoque-layout">
    <div class="estoque-container">
      <div class="topo">
        <h1>Nova ordem de serviço</h1>
        <div class="id-container">
          <label>Número da OS</label>
          <input 
            type="text" 
            class="form-input id-input" 
            v-model="ordemServico.numeroOS" 
            readonly 
            style="width: 200px; background-color: #f5f5f5; font-weight: bold; color: #333;"
          />
        </div>
      </div>

      <div class="form-container">
        <!-- DADOS DO CLIENTE -->
        <div class="form-section">
          <h2>Dados do Cliente</h2>

          <div class="form-group">
            <label>Nome do Cliente</label>
            <input type="text" class="form-input" v-model="ordemServico.cliente" style="width: 70%" />
          </div>

          <div class="form-group">
            <label>Telefone</label>
            <input type="text" class="form-input" v-model="ordemServico.telefone" style="width: 70%" />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-input" v-model="ordemServico.email" style="width: 70%" />
          </div>

          <div class="form-group">
            <label>Endereço</label>
            <input type="text" class="form-input" v-model="ordemServico.endereco" style="width: 70%" />
          </div>

          <div class="form-group">
            <label>CEP</label>
            <input type="text" class="form-input" v-model="ordemServico.cep" style="width: 70%" />
          </div>

          <div class="form-group">
            <label>Estado</label>
            <input type="text" class="form-input" v-model="ordemServico.estado" style="width: 70%" />
          </div>

          <div class="form-group">
            <label>Descrição do problema</label>
            <textarea class="form-textarea" v-model="ordemServico.descricao" style="width: 70%"></textarea>
          </div>
        </div>

        <!-- TIPO DE SERVIÇO -->
        <div class="form-section">
          <h2>Tipo de serviço</h2>
          <div class="form-group">
            <select class="form-input" v-model="ordemServico.tipoServico" style="width: 70%">
              <option value="">Selecione o tipo de serviço</option>
              <option v-for="servico in servicos" :key="servico._id" :value="servico._id">
                {{ servico.nome }} - R$ {{ servico.valor }}
              </option>
            </select>
          </div>

          <!-- Detalhes do serviço selecionado -->
          <div v-if="servicoSelecionado" class="detalhes-card servico-detalhes">
            <h4>🛠️ Serviço Selecionado</h4>
            <p><strong>Nome:</strong> {{ servicoSelecionado.nome }}</p>
            <p><strong>Descrição:</strong> {{ servicoSelecionado.descricao }}</p>
            <p><strong>Valor:</strong> R$ {{ servicoSelecionado.valor }}</p>
            <p><strong>Tempo médio:</strong> {{ servicoSelecionado.tempo_medio }} minutos</p>
          </div>
        </div>

        <!-- PRODUTOS MÚLTIPLOS -->
        <div class="form-section">
          <h2>Produtos/Peças</h2>
          <div class="form-group">
            <div class="produto-selector">
              <select v-model="produtoSelecionado" class="form-input" style="width: 50%">
                <option value="">Selecione um produto</option>
                <option v-for="produto in produtos" :key="produto._id" :value="produto">
                  {{ produto.nome }} - R$ {{ produto.preco }} (Estoque: {{ produto.quantidade }})
                </option>
              </select>
              <input 
                type="number" 
                v-model="quantidadeProduto" 
                placeholder="Qtd" 
                min="1" 
                class="form-input quantidade-input"
              />
              <button 
                type="button" 
                class="botao-adicionar" 
                @click="adicionarProduto"
                :disabled="!produtoSelecionado"
              >
                Adicionar
              </button>
            </div>
          </div>

          <!-- Lista de produtos adicionados -->
          <div v-if="ordemServico.produtos.length > 0" class="produtos-adicionados">
            <h4>📦 Produtos Selecionados</h4>
            <div class="produto-item" v-for="(item, index) in ordemServico.produtos" :key="index">
              <div class="produto-info">
                <strong>{{ item.nome }}</strong>
                <span>Qtd: {{ item.quantidade }}</span>
                <span>Valor unit.: R$ {{ item.preco }}</span>
                <span class="produto-total">Total: R$ {{ (item.quantidade * item.preco).toFixed(2) }}</span>
              </div>
              <button class="botao-remover" @click="removerProduto(index)">❌</button>
            </div>
            <div class="produtos-total">
              <strong>Total Produtos: R$ {{ totalProdutos.toFixed(2) }}</strong>
            </div>
          </div>
        </div>

        <!-- PEÇA NECESSÁRIA ADICIONAL -->
        <div class="form-section">
          <h2>Observações sobre peças</h2>
          <div class="form-group">
            <textarea 
              class="form-textarea" 
              v-model="ordemServico.pecaNecessaria" 
              placeholder="Descreva outras peças necessárias ou observações..."
              style="width: 70%"
            ></textarea>
          </div>
        </div>

        <!-- TÉCNICOS MÚLTIPLOS -->
        <div class="form-section">
          <h2>Técnicos</h2>
          <div class="form-group">
            <div class="tecnico-selector">
              <select v-model="tecnicoSelecionado" class="form-input" style="width: 70%">
                <option value="">Selecione um técnico</option>
                <option v-for="funcionario in funcionarios" :key="funcionario._id" :value="funcionario">
                  {{ funcionario.nome }} - {{ funcionario.funcao }}
                </option>
              </select>
              <button 
                type="button" 
                class="botao-adicionar" 
                @click="adicionarTecnico"
                :disabled="!tecnicoSelecionado"
              >
                Adicionar
              </button>
            </div>
          </div>

          <!-- Lista de técnicos adicionados -->
          <div v-if="ordemServico.tecnicos.length > 0" class="tecnicos-adicionados">
            <h4>👨‍🔧 Técnicos Selecionados</h4>
            <div class="tecnico-item" v-for="(tecnico, index) in ordemServico.tecnicos" :key="index">
              <div class="tecnico-info">
                <strong>{{ tecnico.nome }}</strong>
                <span>{{ tecnico.funcao }}</span>
                <span>{{ tecnico.email }}</span>
                <span>{{ tecnico.telefone }}</span>
              </div>
              <button class="botao-remover" @click="removerTecnico(index)">❌</button>
            </div>
          </div>
        </div>

        <!-- RESUMO -->
        <div class="form-section" v-if="servicoSelecionado || ordemServico.produtos.length > 0 || ordemServico.tecnicos.length > 0">
          <h2>📋 Resumo da Ordem</h2>
          <div class="resumo-container">
            <div v-if="servicoSelecionado" class="resumo-item">
              <span><strong>Serviço:</strong> {{ servicoSelecionado.nome }}</span>
              <span class="valor">R$ {{ servicoSelecionado.valor }}</span>
            </div>
            
            <div v-if="ordemServico.produtos.length > 0" class="resumo-item">
              <span><strong>Produtos ({{ ordemServico.produtos.length }}):</strong></span>
              <span class="valor">R$ {{ totalProdutos.toFixed(2) }}</span>
            </div>
            
            <div v-if="ordemServico.tecnicos.length > 0" class="resumo-item">
              <span><strong>Técnicos:</strong> {{ ordemServico.tecnicos.map(t => t.nome).join(', ') }}</span>
            </div>
            
            <div v-if="valorTotal > 0" class="resumo-total">
              <span><strong>TOTAL:</strong></span>
              <span class="valor-total"><strong>R$ {{ valorTotal.toFixed(2) }}</strong></span>
            </div>
          </div>
        </div>

        <!-- BOTÃO SALVAR -->
        <div class="form-actions">
          <button class="botao-salvar" @click="salvarOrdemServico" :disabled="salvando">
            {{ salvando ? 'Salvando...' : 'Salvar Ordem de Serviço' }}
          </button>
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
      ordemServico: {
        numeroOS: '',
        cliente: '',
        telefone: '',
        email: '',
        endereco: '',
        cep: '',
        estado: '',
        descricao: '',
        tipoServico: '',
        produtos: [],
        pecaNecessaria: '',
        tecnicos: []
      },
      servicos: [],
      produtos: [],
      funcionarios: [],
      produtoSelecionado: null,
      quantidadeProduto: 1,
      tecnicoSelecionado: null,
      salvando: false,
      carregando: true
    };
  },
  computed: {
    servicoSelecionado() {
      if (!this.ordemServico.tipoServico) return null;
      return this.servicos.find(s => s._id === this.ordemServico.tipoServico);
    },
    totalProdutos() {
      return this.ordemServico.produtos.reduce((total, item) => {
        return total + (item.quantidade * item.preco);
      }, 0);
    },
    valorTotal() {
      let total = 0;
      if (this.servicoSelecionado) {
        total += parseFloat(this.servicoSelecionado.valor) || 0;
      }
      return total + this.totalProdutos;
    }
  },
  methods: {
    gerarNumeroOS() {
      return `${Date.now()}`;
    },

    async carregarServicos() {
      try {
        const response = await axios.get('http://localhost:3000/api/servico');
        this.servicos = response.data;
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);
      }
    },

    async carregarProdutos() {
      try {
        const response = await axios.get('http://localhost:3000/api/produto');
        this.produtos = response.data;
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    },

    async carregarFuncionarios() {
      try {
        const response = await axios.get('http://localhost:3000/api/funcionario');
        this.funcionarios = response.data;
      } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
      }
    },

    async carregarTodosDados() {
      this.carregando = true;
      try {
        await Promise.all([
          this.carregarServicos(),
          this.carregarProdutos(),
          this.carregarFuncionarios()
        ]);
      } catch (error) {
        console.error('Erro ao carregar todos os dados:', error);
      } finally {
        this.carregando = false;
      }
    },

    adicionarProduto() {
      if (!this.produtoSelecionado || this.quantidadeProduto <= 0) return;
      const existente = this.ordemServico.produtos.find(p => p._id === this.produtoSelecionado._id);
      if (existente) {
        existente.quantidade += parseInt(this.quantidadeProduto);
      } else {
        this.ordemServico.produtos.push({
          _id: this.produtoSelecionado._id,
          nome: this.produtoSelecionado.nome,
          preco: this.produtoSelecionado.preco,
          quantidade: parseInt(this.quantidadeProduto)
        });
      }
      this.produtoSelecionado = null;
      this.quantidadeProduto = 1;
    },

    removerProduto(index) {
      this.ordemServico.produtos.splice(index, 1);
    },

    adicionarTecnico() {
      if (!this.tecnicoSelecionado) return;
      const existente = this.ordemServico.tecnicos.find(t => t._id === this.tecnicoSelecionado._id);
      if (existente) return;
      this.ordemServico.tecnicos.push({
        _id: this.tecnicoSelecionado._id,
        nome: this.tecnicoSelecionado.nome,
        funcao: this.tecnicoSelecionado.funcao,
        email: this.tecnicoSelecionado.email,
        telefone: this.tecnicoSelecionado.telefone
      });
      this.tecnicoSelecionado = null;
    },

    removerTecnico(index) {
      this.ordemServico.tecnicos.splice(index, 1);
    },

    async salvarOrdemServico() {
  if (!this.ordemServico.cliente.trim()) {
    alert('Nome do cliente é obrigatório');
    return;
  }

  if (!this.ordemServico.tipoServico) {
    alert('Selecione um tipo de serviço');
    return;
  }

  if (this.ordemServico.tecnicos.length === 0) {
    alert('Adicione pelo menos um técnico');
    return;
  }

  this.salvando = true;

  try {
    const dadosOrdem = {
  ...this.ordemServico,
  numeroOS: this.ordemServico.numeroOS, // <- ESSENCIAL
  valorTotal: this.valorTotal,
  produtos: this.ordemServico.produtos.map(p => ({
    produto: p._id,
    quantidade: p.quantidade,
    valor: p.preco
  })),
  tecnicos: this.ordemServico.tecnicos.map(t => t._id)
};

    await axios.post('http://localhost:3000/api/novaos', dadosOrdem);

    alert(`Ordem de serviço salva com sucesso!\nNúmero OS: ${this.ordemServico.numeroOS}\nValor total: R$ ${this.valorTotal.toFixed(2)}`);

    this.ordemServico = {
      numeroOS: this.gerarNumeroOS(),
      cliente: '',
      telefone: '',
      email: '',
      endereco: '',
      cep: '',
      estado: '',
      descricao: '',
      tipoServico: '',
      produtos: [],
      pecaNecessaria: '',
      tecnicos: []
    };

    this.$router.push('/pedido');
  } catch (error) {
    console.error('❌ Erro ao salvar ordem de serviço:', error);
    alert('Erro ao salvar ordem de serviço: ' + (error.response?.data?.erro || error.message));
  } finally {
    this.salvando = false;
  }
}
  },
  mounted() {
    this.ordemServico.numeroOS = this.gerarNumeroOS();
    this.carregarTodosDados();
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

.detalhes-card {
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
}

.servico-detalhes {
  background: #f0f8ff;
  border-left: 4px solid #007bff;
}

.produto-selector,
.tecnico-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.quantidade-input {
  width: 80px;
}

.botao-adicionar {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.botao-adicionar:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.produtos-adicionados,
.tecnicos-adicionados {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
}

.produtos-adicionados h4,
.tecnicos-adicionados h4 {
  margin: 0 0 15px 0;
  color: #007bff;
}

.produto-item,
.tecnico-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
}

.produto-info,
.tecnico-info {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.produto-total {
  color: #14b866;
  font-weight: bold;
}

.botao-remover {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.produtos-total {
  text-align: right;
  padding-top: 10px;
  border-top: 1px solid #ddd;
  margin-top: 10px;
  font-size: 16px;
  color: #14b866;
}

.resumo-container {
  background: #e8f5e8;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #14b866;
}

.resumo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #d4edda;
}

.resumo-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 2px solid #14b866;
  font-size: 18px;
}

.valor {
  color: #14b866;
  font-weight: bold;
}

.valor-total {
  color: #14b866;
  font-weight: bold;
  font-size: 20px;
}

.botao-salvar {
  background: #14b866;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
}

.botao-salvar:hover:not(:disabled) {
  background: #119955;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.botao-salvar:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.form-actions {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
  margin-top: 30px;
}

.id-container {
  margin-top: 15px;
  margin-bottom: 20px;
}

.id-container label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.id-input {
  border: 2px solid #007bff !important;
  background-color: #f8f9fa !important;
  font-family: 'Courier New', monospace;
  text-align: center;
  font-size: 16px !important;
}
</style>
