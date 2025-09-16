<script setup lang="ts">
// 1. Importa a função principal do SDK do Auth0
import { useAuth0 } from '@auth0/auth0-vue';

// 2. Extrai as funções e variáveis de estado que precisamos
const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

// 3. Define as funções que serão chamadas pelos botões
const handleLogin = () => {
  loginWithRedirect({
    appState: {
      target: '/',
    },
  });
};

const handleLogout = () => {
  logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  });
};
</script>

<template>
  <div class="auth-nav">
    <button v-if="!isAuthenticated" @click="handleLogin">Login</button>

    <div v-if="isAuthenticated">
      <span>Olá, {{ user?.name }}</span>
      <button @click="handleLogout">Logout</button>
    </div>
  </div>
</template>

<style scoped>
/* Estilos simples para o nosso componente */
.auth-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}
span {
  font-weight: bold;
}
button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid transparent;
  background-color: #1a1a1a;
  color: rgba(255, 255, 255, 0.87);
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
</style>