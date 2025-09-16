import axios from 'axios'

// Cria uma instância do axios com a URL base da nossa API
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
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

// No futuro, outras funções como createBooking, cancelBooking, etc., irão aqui.
