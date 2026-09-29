<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSearch">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <TaskInput v-model="form.code" label="Código" placeholder="Digite o código" />

      <TaskInput v-model="form.name" label="Nome" placeholder="Digite o nome do projeto" />

      <TaskInput
        v-model="form.responsible"
        label="Responsável"
        placeholder="Digite o nome do responsável"
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

const form = reactive<ProjectFilterValues>({
  code: '',
  name: '',
  responsible: '',
})

function handleSearch() {
  emit('search', { ...form })
}

function handleClear() {
  form.code = ''
  form.name = ''
  form.responsible = ''
  emit('clear')
}
</script>
