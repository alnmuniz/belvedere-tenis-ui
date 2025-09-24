// src/types/api.ts

export interface BookingUser {
  name: string
  apartment: string
}

export interface Booking {
  id: number
  startTime: string // O Instant do Java é serializado como uma string ISO 8601
  endTime: string
  bookingType: 'RESERVA' | 'TURMA COLETIVA' // Usamos tipos literais para segurança
  isPrimeTime: boolean
  user: BookingUser
  classDetails?: string // O '?' indica que a propriedade é opcional
}

export interface UserDTO {
  id: number
  name: string
  email: string
  apartment: string
  role: 'USER' | 'ADMIN'
  status: 'ACTIVE' | 'INACTIVE'
  authProviderId: string
}
