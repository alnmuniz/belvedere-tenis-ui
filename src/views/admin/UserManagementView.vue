<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import {
  fetchAllUsers,
  promoteUser,
  blockUser,
  unblockUser,
  demoteUser,
} from '@/services/apiService'
import type { UserDTO } from '@/types/api'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

import { useAuthStore } from '@/stores/auth'

const { getAccessTokenSilently } = useAuth0()
const toast = useToast()
const confirm = useConfirm()
const users = ref<UserDTO[]>([])
const isLoading = ref(true)
const authStore = useAuthStore() // Use a store

const loadUsers = async () => {
  isLoading.value = true
  try {
    const token = await getAccessTokenSilently()
    const response = await fetchAllUsers(token)
    users.value = response.data
  } catch (error: unknown) {
    console.error('Erro ao carregar usuários:', error)
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Falha ao carregar usuários.',
      life: 3000,
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(loadUsers)

const handleAction = (action: 'promote' | 'block' | 'unblock' | 'demote', user: UserDTO) => {
  // Ação de 'desbloquear' é menos "perigosa", então podemos executá-la diretamente.
  if (action === 'unblock') {
    executeAction(action, user)
    return
  }

  // Prepara a mensagem de confirmação baseada na ação
  let header = ''
  let message = ''
  let icon = ''

  switch (action) {
    case 'promote':
      header = 'Confirmar Promoção'
      message = `Você confirma a promoção de ${user.name} para ADMIN?`
      icon = 'pi pi-user-plus'
      break
    case 'demote':
      header = 'Confirmar Rebaixamento'
      message = `Você confirma o rebaixamento de ${user.name} para USER?`
      icon = 'pi pi-user-minus'
      break
    case 'block':
      header = 'Confirmar Bloqueio'
      message = `Você confirma o bloqueio do usuário ${user.name}? Ele não poderá mais criar reservas.`
      icon = 'pi pi-lock'
      break
  }

  // Mostra o diálogo de confirmação para as ações de promover, rebaixar e bloquear
  confirm.require({
    message: message,
    header: header,
    icon: icon,
    acceptLabel: 'Sim', // <<< Traduzido
    rejectLabel: 'Não', // <<< Traduzido
    accept: () => executeAction(action, user), // A execução e o refresh acontecem aqui
  })
}

const executeAction = async (action: 'promote' | 'block' | 'unblock' | 'demote', user: UserDTO) => {
  try {
    const token = await getAccessTokenSilently()

    // O switch aqui garante que a chamada de API correta seja feita
    switch (action) {
      case 'promote':
        await promoteUser(token, user.id)
        break
      case 'block':
        await blockUser(token, user.id)
        break
      case 'unblock':
        await unblockUser(token, user.id)
        break
      case 'demote':
        await demoteUser(token, user.id)
        break
    }

    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Ação executada com sucesso!',
      life: 3000,
    })

    // O refresh da lista, que garante a atualização automática da tela
    await loadUsers()
  } catch (error: unknown) {
    const errorMessage =
      (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
      `Falha na operação de ${action}.`
    toast.add({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 5000 })
  }
}

const getSeverityForStatus = (status: 'ACTIVE' | 'INACTIVE') => {
  console.log(`Status recebido em getSeverityForStatus: ${status}`)
  return status === 'ACTIVE' ? 'success' : 'danger'
}

const getSeverityForRole = (role: 'USER' | 'ADMIN') => (role === 'ADMIN' ? 'info' : 'secondary')

const getStatusText = (status: 'ACTIVE' | 'INACTIVE') => (status === 'ACTIVE' ? 'Ativo' : 'Inativo')
</script>

<template>
  <div>
    <h1>Gerenciamento de Usuários</h1>
    <DataTable :value="users" :loading="isLoading" paginator :rows="10">
      <Column field="name" header="Nome"></Column>
      <Column field="apartment" header="Apto"></Column>
      <Column field="email" header="Email"></Column>
      <Column header="Status">
        <template #body="slotProps">
          <Tag
            :severity="getSeverityForStatus(slotProps.data.status)"
            :value="getStatusText(slotProps.data.status)"
          ></Tag>
        </template>
      </Column>
      <Column header="Papel">
        <template #body="slotProps">
          <Tag
            :severity="getSeverityForRole(slotProps.data.role)"
            :value="slotProps.data.role"
          ></Tag>
        </template>
      </Column>
      <Column header="Ações">
        <template #body="slotProps">
          <div class="actions" v-if="slotProps.data.authProviderId !== authStore.user?.sub">
            <Button
              v-if="slotProps.data.role !== 'ADMIN'"
              icon="pi pi-user-plus"
              class="p-button-rounded p-button-success p-button-sm"
              @click="handleAction('promote', slotProps.data)"
              v-tooltip.top="'Promover para Admin'"
            />
            <Button
              v-if="slotProps.data.status === 'ACTIVE'"
              icon="pi pi-lock"
              class="p-button-rounded p-button-warning p-button-sm"
              @click="handleAction('block', slotProps.data)"
              v-tooltip.top="'Bloquear Usuário'"
            />
            <Button
              v-if="slotProps.data.status === 'INACTIVE'"
              icon="pi pi-lock-open"
              class="p-button-rounded p-button-info p-button-sm"
              @click="handleAction('unblock', slotProps.data)"
              v-tooltip.top="'Desbloquear Usuário'"
            />
            <Button
              v-if="slotProps.data.role === 'ADMIN'"
              icon="pi pi-user-minus"
              class="p-button-rounded p-button-danger p-button-sm"
              @click="handleAction('demote', slotProps.data)"
              v-tooltip.top="'Remover permissão de Admin'"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  gap: 0.5rem;
}
</style>
