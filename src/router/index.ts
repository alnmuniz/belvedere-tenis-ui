import { createRouter, createWebHistory } from 'vue-router'

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
  ],
})

export default router
