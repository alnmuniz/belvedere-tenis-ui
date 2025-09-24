import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuth0 } from '@auth0/auth0-vue'

export const useAuthStore = defineStore('auth', () => {
  const { user, isAuthenticated } = useAuth0()

  const isAdmin = computed(() => {
    if (isAuthenticated.value && user.value) {
      // Lembre-se que esta é a claim customizada que criamos na Action do Auth0
      const roles = user.value['https://belvedere.tenis.api/roles'] as string[]
      return roles?.includes('ROLE_ADMIN')
    }
    return false
  })

  return { user, isAuthenticated, isAdmin }
})
