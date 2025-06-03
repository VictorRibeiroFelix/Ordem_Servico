// Para Vue 3
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../view/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/estoque',
    name: 'GestaoEstoque',
    component: () => import('../view/GestaoEstoqueView.vue')
  },
  {
    path: '/pedido',
    name: 'GestaoPedido',
    component: () => import('../view/GestaoPedidoView.vue')
  },
  {
    path: '/novaos',
    name: 'NovaOS',
    component: () => import('../view/NovaOSView.vue')
  },
  {
    path: '/produto',
    name: 'Produto',
    component: () => import('../view/CadastroProdutoView.vue')
  },
  {
    path: '/editarproduto',
    name: 'EditarProduto',
    component: () => import('../view/EditarProdutoView.vue')
  },
  {
    path: '/financeiro',
    name: 'Financeiro',
    component: () => import('../view/FinanceiroView.vue')
  },
  {
    path: '/recibo',
    name: 'Recibo',
    component: () => import('../view/ReciboView.vue')
  },
  {
    path: '/editarnovaos',
    name: 'EditarNovaOS',
    component: () => import('../view/EditarNovaOSView.vue')
  },
  {
    path: '/servico',
    name: 'Servico',
    component: () => import('../view/CadastroServicoView.vue')
  },
  {
    path: '/listaservico',
    name: 'ListaServico',
    component: () => import('../view/ListaServicoView.vue')
  },
  {
    path: '/editarservico',
    name: 'EditarServico',
    component: () => import('../view/EditarServicoView.vue')
  },
  {
    path: '/listacliente',
    name: 'ListaCliente',
    component: () => import('../view/ListaClienteView.vue')
  },
  {
    path: '/cliente',
    name: 'Cliente',
    component: () => import('../view/CadastroClienteView.vue')
  },
  {
    path: '/editarcliente/:id',
    name: 'EditarCliente',
    component: () => import('../view/EditarClienteView.vue')
  },
  {
    path: '/listafuncionario',
    name: 'ListaFuncionario',
    component: () => import('../view/ListaFuncionarioView.vue')
  },
  {
    path: '/funcionario',
    name: 'Funcionario',
    component: () => import('../view/CadastroFuncionarioView.vue')
  },
  {
    path: '/editarfuncionario/:id',
    name: 'EditarFuncionario',
    component: () => import('../view/EditarFuncionarioView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
