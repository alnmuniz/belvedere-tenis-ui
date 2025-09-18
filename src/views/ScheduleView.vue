<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { fetchBookings } from '@/services/apiService' // Importa nossa função

const { getAccessTokenSilently } = useAuth0()

// Cria variáveis reativas para guardar os dados e o estado de carregamento
const bookings = ref<any[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const currentDate = ref<string>('')

// onMounted é um "gancho de ciclo de vida" que roda assim que o componente é criado
onMounted(async () => {
  try {
    // 1. Pega o token de acesso do Auth0 de forma segura
    const token = await getAccessTokenSilently()

    // 2. Gera a data atual no formato 'YYYY-MM-DD'
    const today = new Date().toISOString().split('T')[0]

    // 3. Formata a data para exibição no título
    const todayDate = new Date()
    const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const weekday = weekdays[todayDate.getDay()]
    const day = String(todayDate.getDate()).padStart(2, '0')
    const month = String(todayDate.getMonth() + 1).padStart(2, '0')
    currentDate.value = `${weekday} ${day}/${month}`

    // 4. Chama nossa API usando o token com a data atual
    const response = await fetchBookings(token, today)

    // 5. Atualiza nossa variável com os dados recebidos
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
    <h1>Agenda da Quadra - {{ currentDate }}</h1>

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
        <span v-if="booking.type === 'AULA'" style="color: #2563eb; font-weight: bold">
          - AULA</span
        >
      </li>
      <li v-if="bookings.length === 0">Nenhuma reserva para este dia.</li>
    </ul>
  </div>
</template>
