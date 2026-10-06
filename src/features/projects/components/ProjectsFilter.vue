<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSearch">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <TaskInput
        v-model="form.name"
        label="Nome"
        placeholder="Digite o nome do projeto"
      />
      <TaskSelect
        v-model="form.status"
        label="Status"
        placeholder="Todos os status"
        :options="statusOptions"
      />
    </div>

    <div class="flex items-center justify-end gap-3">
      <TaskButton variant="secondary" type="button" @click="handleClear">
        Limpar
      </TaskButton>
      <TaskButton type="submit" @click="handleSearch">
        Pesquisar
      </TaskButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TaskInput from '@/components/TaskInput.vue'
import TaskSelect from '@/components/TaskSelect.vue'
import TaskButton from '@/components/TaskButton.vue'
import type { ProjectFilterValues } from '@/types'

defineOptions({
  name: 'ProjectsFilter',
})

export type { ProjectFilterValues }

const emit = defineEmits<{
  (event: 'search', filters: ProjectFilterValues): void
  (event: 'clear'): void
}>()

const statusOptions = [
  { label: 'Todos', value: '' },
  { label: 'Ativo', value: 'true' },
  { label: 'Inativo', value: 'false' },
]

const form = reactive<ProjectFilterValues>({
  name: '',
  status: '',
})

function handleSearch() {
  emit('search', { ...form })
}

function handleClear() {
  form.name = ''
  form.status = ''
  emit('clear')
}
</script>
