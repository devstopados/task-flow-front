<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSearch">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <TaskInput v-model="form.code" label="Código" placeholder="Digite o código" />

      <TaskInput v-model="form.name" label="Nome" placeholder="Digite o nome da tarefa" />

      <TaskSelect
        v-model="form.project"
        label="Projeto"
        placeholder="Selecione o projeto"
        :options="projectOptions"
        clearable
      />
    </div>

    <div class="flex items-center justify-end gap-3">
      <TaskButton variant="secondary" type="button" @click="handleClear"> Limpar </TaskButton>
      <TaskButton type="submit"> Pesquisar </TaskButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TaskInput from '@/components/TaskInput.vue'
import TaskSelect from '@/components/TaskSelect.vue'
import TaskButton from '@/components/TaskButton.vue'
import type { TaskFilterValues } from '@/types'

defineOptions({
  name: 'TasksFilter',
})

export type { TaskFilterValues }

const emit = defineEmits<{
  (event: 'search', filters: TaskFilterValues): void
  (event: 'clear'): void
}>()

const form = reactive<TaskFilterValues>({
  code: '',
  name: '',
  project: '',
})

const projectOptions = [{ label: 'Nome do projeto', value: 'project-1' }]

function handleSearch() {
  emit('search', { ...form })
}

function handleClear() {
  form.code = ''
  form.name = ''
  form.project = ''
  emit('clear')
}
</script>
