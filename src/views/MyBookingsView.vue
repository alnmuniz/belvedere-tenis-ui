<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { fetchMyBooking, cancelBooking } from '@/services/apiService'
import type { Booking } from '@/types/api'
import Button from 'primevue/button'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const { getAccessTokenSilently } = useAuth0()
const confirm = useConfirm()
const toast = useToast()

const myBooking = ref<Booking | null>(null)
const isLoading = ref(true)

const loadMyBooking = async () => {
  try {
    const token = await getAccessTokenSilently()
    const response = await fetchMyBooking(token)
    myBooking.value = response.data || null
  } catch (error) {
    console.error('Falha ao buscar reserva:', error)
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Não foi possível buscar sua reserva.',
      life: 3000,
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(loadMyBooking)

const handleCancel = (bookingId: number) => {
  confirm.require({
    message: 'Você tem certeza que deseja cancelar esta reserva?',
    header: 'Confirmação de Cancelamento',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sim, cancelar',
    rejectLabel: 'Não',
    accept: async () => {
      try {
        const token = await getAccessTokenSilently()
        await cancelBooking(token, bookingId)
        toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Sua reserva foi cancelada.',
          life: 3000,
        })
        myBooking.value = null // Limpa a reserva da tela
      } catch (error: unknown) {
        const errorMessage =
          error && typeof error === 'object' && 'response' in error
            ? (error as { response?: { data?: { error?: string } } }).response?.data?.error
            : 'Não foi possível cancelar a reserva.'
        toast.add({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 5000 })
      }
    },
  })
}
</script>

<template>
  <div>
    <h1>Minhas Reservas</h1>
    <div v-if="isLoading">Carregando...</div>
    <div v-else-if="myBooking" class="booking-card">
      <p><strong>Apartamento:</strong> {{ myBooking.user.apartment }}</p>
      <p><strong>Data:</strong> {{ new Date(myBooking.startTime).toLocaleDateString('pt-BR') }}</p>
      <p>
        <strong>Horário:</strong>
        {{
          new Date(myBooking.startTime).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })
        }}
        -
        {{
          new Date(myBooking.endTime).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })
        }}
      </p>
      <Button
        label="Cancelar Reserva"
        icon="pi pi-times"
        class="p-button-danger"
        @click="handleCancel(myBooking.id)"
      />
    </div>
    <div v-else>
      <p>Você não possui nenhuma reserva ativa.</p>
    </div>
  </div>
</template>

<style scoped>
.booking-card {
  border: 1px solid #ccc;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 400px;
  background-color: #f9f9f9;
  color: var(--vt-c-text-light-1);
}
.booking-card p {
  margin: 0.5rem 0;
}
</style>
