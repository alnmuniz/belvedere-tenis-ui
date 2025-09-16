<script setup lang="ts">
import { RouterView } from 'vue-router'
import AuthNav from './components/AuthNav.vue' // 1. Importa nosso novo componente
</script>

<template>
  <header>
    <div class="wrapper">
      <AuthNav />
      <nav>
        <RouterLink to="/schedule">Agenda</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}
</style>
