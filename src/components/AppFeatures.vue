<template>
  <section class="features-section">
    <div class="features-container">
      <h2>Porquê escolher o fluxo de serviço?</h2>
      <p class="features-description">
        Oferecemos uma solução abrangente concebida para simplificar as operações e capacitar a sua equipa.
      </p>
      <div class="features-grid">
        <div class="feature-card">
          <h3>Gestão intuitiva de pedidos</h3>
          <p>
            Faça a gestão eficaz das ordens de serviço, desde o início até à conclusão. Atribua tarefas, acompanhe o progresso e comunique com a sua equipa em tempo real.
          </p>
        </div>
        <div class="feature-card">
          <h3>Supervisão Financeira</h3>
          <p>
            Mantenha uma visão clara da saúde financeira da sua empresa. Acompanhe faturas, pagamentos e despesas com facilidade.
          </p>
        </div>
        <div class="feature-card">
          <h3>Acompanhamento de inventário</h3>
          <p>
            Monitorize os seus níveis de stock e movimentação sem esforço. Receba alertas de stock baixo e otimize os seus recursos.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features-section {
  display: flex;
  justify-content: center;
  padding: 60px 20px;
}

.features-container {
  width: 959px;
  text-align: center;
}

.features-description {
  margin: 10px 0 40px;
  color: #555;
  font-size: 20px;
}

.features-grid {
  display: flex;
  justify-content: space-between;
  gap: 28px;
}

.feature-card {
  width: 301px;
  height: 178px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);
  text-align: left;
}

.feature-card h3 {
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 600;
}

.feature-card p {
  font-size: 18px;
  color: #444;
}

h2{
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
