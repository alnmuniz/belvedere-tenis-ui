<script setup lang="ts">
import { RouterView } from 'vue-router'
import AuthNav from './components/AuthNav.vue' // 1. Importa nosso novo componente
import ConfirmDialog from 'primevue/confirmdialog' // Importe o componente
import Toast from 'primevue/toast' // Importe o componente
import { useAuthStore } from '@/stores/auth' // Importe a store
import { watch, toRaw } from 'vue'

const authStore = useAuthStore() // Use a store

// 2. Adicione este "observador" para depuração
watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      console.log('--- DEBUG AUTH ---')
      console.log("Objeto 'user' (RAW) recebido do Auth0:", toRaw(newUser))
      console.log('--- FIM DEBUG ---')
    }
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <ConfirmDialog />
  <Toast />

  <header>
    <div class="wrapper">
      <AuthNav />
      <nav v-if="authStore.isAuthenticated">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/schedule">Agenda</RouterLink>
        <RouterLink to="/my-bookings">Minhas Reservas</RouterLink>
        <RouterLink v-if="authStore.isAdmin" to="/admin/users">Painel Admin</RouterLink>
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
