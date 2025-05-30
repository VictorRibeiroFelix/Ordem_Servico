<template>
  <section class="hero">
    <div class="overlay">
      <h2>Simplifique o seu negócio com o<br />fluxo de serviço</h2>
      <p>
        Aumente a eficiência e organização na gestão de ordens de serviço, no acompanhamento financeiro e na supervisão do stock de forma integrada.
      </p>
      <button class="start-btn">Comece</button>
    </div>
  </section>
</template>

<style scoped>
.hero {
  width: 959px;
  height: 512px;
  /*background: url('@/assets/home.jpg') center/cover no-repeat;*/
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.overlay {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
  color: white;
  transform: translateY(30px); /* Levemente mais para baixo */
}

.overlay h2 {
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 10px;
}

.overlay p {
  font-size: 17px;
  max-width: 700px;
  margin-bottom: 20px;
  line-height: 1.5;
}

.start-btn {
  padding: 10px 24px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  font-size: 17px;
}
</style>
