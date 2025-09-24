<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { fetchBookings, createBooking } from '@/services/apiService'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import axios from 'axios'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

// 1. Importa nosso novo tipo de Booking!
import type { Booking } from '@/types/api'

const { getAccessTokenSilently } = useAuth0()
const confirm = useConfirm() // Hook para usar o serviço de confirmação
const toast = useToast() // Hook para usar o serviço de toast

const selectedDate = ref(new Date())
// 2. Usa o tipo Booking em vez de 'any'
const bookings = ref<Booking[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const loadSchedule = async (date: Date) => {
  isLoading.value = true
  error.value = null
  try {
    const formattedDate = date.toISOString().split('T')[0]
    const token = await getAccessTokenSilently()
    const response = await fetchBookings(token, formattedDate)
    bookings.value = response.data
  } catch (e: unknown) {
    // <<< MUDANÇA 1: De 'any' para 'unknown'

    // MUDANÇA 2: Adiciona uma verificação de tipo antes de usar a variável 'e'
    let errorMessage = 'Ocorreu um erro desconhecido.'
    if (axios.isAxiosError(e)) {
      // Se for um erro do axios, podemos pegar uma mensagem mais específica da resposta da API
      errorMessage = e.response?.data?.error || e.message
    } else if (e instanceof Error) {
      // Se for um erro genérico do JavaScript
      errorMessage = e.message
    }

    error.value = `Falha ao buscar as reservas: ${errorMessage}`
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

// 3. Lógica corrigida, sem bugs e mais robusta
const timeSlots = computed(() => {
  const slots = []
  // Pega o início do dia selecionado para evitar problemas de fuso horário na comparação
  const startOfSelectedDay = new Date(selectedDate.value)
  startOfSelectedDay.setHours(0, 0, 0, 0)

  for (let hour = 6; hour <= 21; hour++) {
    // Cria o início e o fim de cada slot de horário para o dia selecionado
    const slotStart = new Date(startOfSelectedDay)
    slotStart.setHours(hour)

    const slotEnd = new Date(startOfSelectedDay)
    slotEnd.setHours(hour + 1)

    // Encontra a reserva que começa DENTRO deste slot de 1 hora
    const booking = bookings.value.find((b) => {
      const bookingStart = new Date(b.startTime) // Converte a string ISO para um objeto Date
      return bookingStart >= slotStart && bookingStart < slotEnd
    })

    slots.push({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      isBooked: !!booking,
      details: booking ? `${booking.bookingType} - ${booking.user.name}` : 'Livre',
    })
  }
  return slots
})

onMounted(() => {
  loadSchedule(selectedDate.value)
})

watch(selectedDate, (newDate) => {
  if (newDate) {
    loadSchedule(newDate)
  }
})

const handleReserve = (hour: string) => {
  const [hourNumber] = hour.split(':').map(Number)

  const reservationDate = new Date(selectedDate.value)
  reservationDate.setHours(hourNumber, 0, 0, 0)

  // Pede confirmação ao usuário
  confirm.require({
    message: `Você confirma a reserva da quadra para ${reservationDate.toLocaleDateString('pt-BR')} às ${hour}?`,
    header: 'Confirmação de Reserva',
    icon: 'pi pi-calendar-plus',
    acceptLabel: 'Sim, confirmar',
    rejectLabel: 'Cancelar',
    accept: async () => {
      // Se o usuário clicar 'Sim', executa a lógica de reserva
      try {
        const token = await getAccessTokenSilently()
        const startTimeISO = reservationDate.toISOString() // Converte para string UTC

        await createBooking(token, startTimeISO)

        // Sucesso! Mostra notificação e recarrega a agenda
        toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Reserva efetuada!',
          life: 3000,
        })
        loadSchedule(selectedDate.value)
      } catch (e: unknown) {
        // Erro! Mostra notificação com a mensagem da API
        let errorMessage = 'Não foi possível completar a reserva.'
        if (axios.isAxiosError(e)) {
          errorMessage = e.response?.data?.error || e.message
        } else if (e instanceof Error) {
          errorMessage = e.message
        }
        toast.add({
          severity: 'error',
          summary: 'Erro na Reserva',
          detail: errorMessage,
          life: 5000,
        })
        console.error(e)
      }
    },
  })
}
</script>

<template>
  <div class="schedule-container">
    <div class="calendar-panel">
      <h2>Selecione uma data</h2>
      <Calendar v-model="selectedDate" inline dateFormat="dd/mm/yy" />
    </div>
    <div class="schedule-panel">
      <h2>Agenda para {{ selectedDate.toLocaleDateString('pt-BR') }}</h2>

      <div v-if="isLoading">
        <p>Carregando agenda...</p>
      </div>
      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
      </div>

      <ul v-if="!isLoading && !error" class="slots-list">
        <li
          v-for="slot in timeSlots"
          :key="slot.hour"
          class="slot-item"
          :class="{ booked: slot.isBooked }"
        >
          <span class="slot-time">{{ slot.hour }}</span>
          <span class="slot-status">{{ slot.details }}</span>
          <Button
            v-if="!slot.isBooked"
            label="Reservar"
            @click="handleReserve(slot.hour)"
            class="p-button-sm"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Estilos não mudam */
.schedule-container {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}
.calendar-panel {
  flex-basis: 350px;
}
.schedule-panel {
  flex-grow: 1;
}
.slots-list {
  list-style: none;
  padding: 0;
}
.slot-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  background-color: #f0fdf4; /* Verde claro para livre */
  border: 1px solid #bbf7d0;
}
.slot-item:not(.booked) {
  color: var(--vt-c-text-light-1);
}
.slot-item.booked {
  background-color: #fef2f2; /* Vermelho claro para ocupado */
  border: 1px solid #fecaca;
  color: #7f1d1d;
}
.slot-time {
  font-weight: bold;
}
.error-message {
  color: #b91c1c;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  padding: 1rem;
  border-radius: 6px;
}
</style>
