<template>
  <nav class="navbar">
    <div class="container">
      <div class="logo">Service Flow</div>
      <ul class="nav-links">
        <li>
          <router-link to="/pedido" class="nav-item">Gestão de pedidos</router-link>
        </li>
        <li>
          <router-link to="/financeiro" class="nav-item">Financeiro</router-link>
        </li>
        <li>
          <router-link to="/estoque" class="nav-item">Inventário</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 9px 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.nav-links {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 24px;
  margin: 0;
  padding: 0;
}

/* Todos os links */
.nav-item {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.3s, color 0.3s;
}

/* Quando ativo (na rota atual) */
.router-link-active.nav-item {
  background-color: #e0e7ff; /* tipo marca texto */
  color: #1d4ed8; /* azul escuro */
  font-weight: 600;
}

.login-btn {
  background-color: #2563eb;
  color: white;
  padding: 8px 20px;
  border: none;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-btn:hover {
  background-color: #1d4ed8;
}
</style>
