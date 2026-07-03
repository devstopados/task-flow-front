<template>
  <TaskModal
    :model-value="modelValue"
    title="Filtros"
    subtitle="Filtre os projetos por nome, código ou responsável"
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
        placeholder="Digite o nome do projeto"
      />

      <TaskInput
        v-model="form.responsible"
        label="Responsável"
        placeholder="Digite o nome do responsável"
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
import TaskButton from '@/components/TaskButton.vue'

defineOptions({
  name: 'ProjectFilterModal',
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
  responsible: '',
})

function handleSearch() {
  emit('search', { ...form })
  emit('update:modelValue', false)
}

function handleClear() {
  form.code = ''
  form.name = ''
  form.responsible = ''
  emit('clear')
  emit('update:modelValue', false)
}

function handleCancel() {
  form.code = ''
  form.name = ''
  form.responsible = ''
}
</script>
