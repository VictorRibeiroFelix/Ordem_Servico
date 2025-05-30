<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-links">
        <a href="/sobre">Sobre nós</a>
        <a href="/contato">Contato</a>
        <a href="/privacidade">Política de Privacidade</a>
        <a href="/termos">Termos de Serviço</a>
      </div>
      <p class="footer-copy">&copy; 2024 <strong>Service Flow</strong>. Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 30px 0;
  font-size: 14px;
}

.footer-container {
  max-width: 960px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.footer-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 150px;
  font-size: 18px;
}

.footer-links a {
  text-decoration: none; /* Remove o sublinhado */
  color: inherit; /* Mantém a cor padrão ou herda do pai */
  transition: color 0.3s ease; /* Adiciona transição suave para hover */
}

.footer-links a:hover {
  color: #007bff; /* Muda a cor ao passar o mouse (azul como exemplo) */
  text-decoration: underline; /* Opcional: adiciona sublinhado no hover */
}
</style>