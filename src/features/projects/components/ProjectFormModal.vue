<template>
  <TaskModal
    :model-value="modelValue"
    title="Novo Projeto"
    subtitle="Preencha os dados para criar um novo projeto"
    confirm-label="Salvar"
    :loading="loading"
    @update:model-value="emit('update:modelValue', $event)"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <form class="flex flex-col gap-4" @submit.prevent="handleConfirm">
      <div class="grid grid-cols-2 gap-4">
        <TaskInput
          v-model="form.name"
          label="Nome do projeto"
          placeholder="Digite o nome"
          required
          :error="errors.name"
          @blur="markTouched('name')"
        />

        <TaskInput
          v-model="form.responsible"
          label="Responsável"
          placeholder="Digite o responsável"
          required
          :error="errors.responsible"
          @blur="markTouched('responsible')"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <TaskInput
          v-model="form.startDate"
          label="Data de início"
          type="date"
          required
          :error="errors.startDate"
          @blur="markTouched('startDate')"
        />

        <TaskSelect
          v-model="form.status"
          label="Status"
          placeholder="Selecione o status"
          :options="statusOptions"
          required
          :error="errors.status"
          @blur="markTouched('status')"
        />
      </div>

      <TaskTextArea
        v-model="form.description"
        label="Descrição"
        placeholder="Descreva o projeto"
        :rows="3"
        :max-length="500"
        show-counter
      />
    </form>
  </TaskModal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import TaskModal from '@/components/TaskModal.vue'
import TaskInput from '@/components/TaskInput.vue'
import TaskSelect from '@/components/TaskSelect.vue'
import TaskTextArea from '@/components/TaskTextArea.vue'

defineOptions({
  name: 'ProjectFormModal',
})

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'saved', payload: typeof form): void
}>()

type FieldName = 'name' | 'responsible' | 'startDate' | 'status'

const loading = ref(false)
const submitted = ref(false)

const form = reactive({
  name: '',
  responsible: '',
  startDate: '',
  status: '',
  description: '',
})

const touched = reactive<Record<FieldName, boolean>>({
  name: false,
  responsible: false,
  startDate: false,
  status: false,
})

const statusOptions = [
  { label: 'Não Iniciado', value: 'Não Iniciado' },
  { label: 'Em andamento', value: 'Em andamento' },
  { label: 'Pausado', value: 'Pausado' },
  { label: 'Concluído', value: 'Concluído' },
]

const errors = reactive<Record<FieldName, string>>({
  name: '',
  responsible: '',
  startDate: '',
  status: '',
})

function validate(): boolean {
  errors.name = form.name.trim() ? '' : 'Informe o nome do projeto.'
  errors.responsible = form.responsible.trim() ? '' : 'Informe o responsável.'
  errors.startDate = form.startDate ? '' : 'Informe a data de início.'
  errors.status = form.status ? '' : 'Selecione um status.'
  return !Object.values(errors).some(Boolean)
}

function markTouched(field: FieldName) {
  touched[field] = true
  validate()
}

function resetForm() {
  form.name = ''
  form.responsible = ''
  form.startDate = ''
  form.status = ''
  form.description = ''
  submitted.value = false
  Object.keys(touched).forEach((k) => (touched[k as FieldName] = false))
  Object.keys(errors).forEach((k) => (errors[k as FieldName] = ''))
}

async function handleConfirm() {
  submitted.value = true
  if (!validate()) return

  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    emit('saved', { ...form })
    emit('update:modelValue', false)
    resetForm()
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  resetForm()
}
</script>
