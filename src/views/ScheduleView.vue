<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { fetchBookings } from '@/services/apiService' // Importa nossa função

const { getAccessTokenSilently } = useAuth0()

// Cria variáveis reativas para guardar os dados e o estado de carregamento
const bookings = ref<any[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

// onMounted é um "gancho de ciclo de vida" que roda assim que o componente é criado
onMounted(async () => {
  try {
    // 1. Pega o token de acesso do Auth0 de forma segura
    const token = await getAccessTokenSilently()

    // 2. Chama nossa API usando o token (usando uma data fixa por enquanto)
    const response = await fetchBookings(token, '2025-09-10')

    // 3. Atualiza nossa variável com os dados recebidos
    bookings.value = response.data
  } catch (e: any) {
    error.value = 'Falha ao buscar as reservas.'
    console.error(e)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="schedule">
    <h1>Agenda da Quadra</h1>

    <div v-if="isLoading">
      <p>Carregando agenda...</p>
    </div>

    <div v-if="error">
      <p style="color: red">{{ error }}</p>
    </div>

    <ul v-if="!isLoading && !error">
      <li v-for="booking in bookings" :key="booking.id">
        <strong>{{
          new Date(booking.startTime).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })
        }}</strong>
        - Reservado por: {{ booking.user.name }} (Apto {{ booking.user.apartment }})
      </li>
      <li v-if="bookings.length === 0">Nenhuma reserva para este dia.</li>
    </ul>
  </div>
</template>
