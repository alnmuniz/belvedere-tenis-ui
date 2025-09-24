import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ADICIONE ESTE BLOCO DE CÓDIGO:
    {
      path: '/schedule',
      name: 'schedule',
      // Lazy-loading: o código desta página só será carregado quando ela for acessada.
      component: () => import('../views/ScheduleView.vue'),
    },
    {
      path: '/my-bookings',
      name: 'my-bookings',
      component: () => import('../views/MyBookingsView.vue'),
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('../views/admin/UserManagementView.vue'),
      beforeEnter: (to, from, next) => {
        // Lógica de proteção da rota
        const authStore = useAuthStore()
        if (authStore.isAdmin) {
          next() // Permite o acesso
        } else {
          next({ name: 'home' }) // Redireciona para a Home se não for admin
        }
      },
    },
  ],
})

export default router
