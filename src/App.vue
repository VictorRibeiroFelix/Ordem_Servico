<template>
  <div>
    <AppNavbar />
    <router-view /> <!-- Aqui será renderizada a página atual -->
    <AppFooter />
  </div>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
</script>

