import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 1. Importe o createAuth0
import { createAuth0 } from '@auth0/auth0-vue'


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 2. Use o plugin do Auth0 com as configurações
app.use(
    createAuth0({
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE
      }
    })
  )

app.mount('#app')