<template>
  <TaskModal
    :model-value="modelValue"
    title="Filtros"
    subtitle="Filtre as tarefas por nome, código ou projeto"
    size="sm"
    @update:model-value="emit('update:modelValue', $event)"
    @cancel="handleCancel"
  >
    <form class="flex flex-col gap-4" @submit.prevent="handleSearch">
      <TaskInput
        v-model="form.code"
        label="Código"
        placeholder="Digite o código"
      />

      <TaskInput
        v-model="form.name"
        label="Nome"
        placeholder="Digite o nome da tarefa"
      />

      <TaskSelect
        v-model="form.project"
        label="Projeto"
        placeholder="Selecione o projeto"
        :options="projectOptions"
        clearable
      />
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <TaskButton variant="secondary" @click="handleClear"> Limpar </TaskButton>
        <TaskButton @click="handleSearch"> Pesquisar </TaskButton>
      </div>
    </template>
  </TaskModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import TaskModal from '@/components/TaskModal.vue'
import TaskInput from '@/components/TaskInput.vue'
import TaskSelect from '@/components/TaskSelect.vue'
import TaskButton from '@/components/TaskButton.vue'

defineOptions({
  name: 'TaskFilterModal',
})

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'search', filters: typeof form): void
  (event: 'clear'): void
}>()

const form = reactive({
  code: '',
  name: '',
  project: '',
})

const projectOptions = [
  { label: 'Nome do projeto', value: 'project-1' },
]

function handleSearch() {
  emit('search', { ...form })
  emit('update:modelValue', false)
}

function handleClear() {
  form.code = ''
  form.name = ''
  form.project = ''
  emit('clear')
  emit('update:modelValue', false)
}

function handleCancel() {
  form.code = ''
  form.name = ''
  form.project = ''
}
</script>
