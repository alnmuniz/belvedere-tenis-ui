import axios from 'axios'
import type { Booking } from '@/types/api' // Importe nosso tipo Booking
import type { UserDTO } from '@/types/api' // Importe nosso tipo UserDTO

// Cria uma instância do axios com a URL base da nossa API
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
})

/**
 * Busca as reservas para uma data específica.
 * @param token O token de acesso JWT do usuário logado.
 * @param date A data no formato 'YYYY-MM-DD'.
 * @returns Uma promessa com a lista de reservas.
 */
export const fetchBookings = (token: string, date: string) => {
  return apiClient.get('/bookings', {
    params: {
      date: date,
    },
    headers: {
      // Anexa o token de portador (Bearer Token) ao cabeçalho de autorização
      Authorization: `Bearer ${token}`,
    },
  })
}

/**
 * Cria uma nova reserva.
 * @param token O token de acesso JWT do usuário logado.
 * @param startTime O horário de início da reserva no formato string ISO 8601 (UTC).
 * @returns Uma promessa com a reserva criada.
 */
export const createBooking = (token: string, startTime: string): Promise<{ data: Booking }> => {
  return apiClient.post(
    '/bookings',
    { startTime }, // Corpo da requisição
    {
      headers: {
        Authorization: `Bearer ${token}`, // Cabeçalho de autorização
      },
    },
  )
}

/**
 * Busca a reserva ativa do usuário logado.
 */
export const fetchMyBooking = (token: string): Promise<{ data: Booking | '' }> => {
  return apiClient.get('/bookings/my-booking', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

/**
 * Cancela uma reserva específica.
 */
export const cancelBooking = (token: string, bookingId: number): Promise<void> => {
  return apiClient.delete(`/bookings/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const fetchAllUsers = (token: string): Promise<{ data: UserDTO[] }> => {
  return apiClient.get('/admin/users', { headers: { Authorization: `Bearer ${token}` } })
}

export const promoteUser = (token: string, userId: number): Promise<{ data: UserDTO }> => {
  return apiClient.post(
    `/admin/users/${userId}/promote`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  )
}

export const blockUser = (token: string, userId: number): Promise<{ data: UserDTO }> => {
  return apiClient.post(
    `/admin/users/${userId}/block`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  )
}

export const unblockUser = (token: string, userId: number): Promise<{ data: UserDTO }> => {
  return apiClient.post(
    `/admin/users/${userId}/unblock`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  )
}

export const demoteUser = (token: string, userId: number): Promise<{ data: UserDTO }> => {
  return apiClient.post(
    `/admin/users/${userId}/demote`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  )
}
