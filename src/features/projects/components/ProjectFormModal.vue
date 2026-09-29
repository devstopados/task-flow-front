<template>
  <TaskModal
    :model-value="modelValue"
    title="Novo Projeto"
    subtitle="Preencha os dados para criar um novo projeto"
    confirm-label="Salvar"
    :loading="loading"
    @update:model-value="emit('update:modelValue', $event)"
    @confirm="onSubmit"
    @cancel="handleCancel"
  >
    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <div class="grid grid-cols-2 gap-4">
        <TaskInput
          v-model="name"
          v-bind="nameAttrs"
          label="Nome do projeto"
          placeholder="Digite o nome"
          required
          :error="errors.name"
        />

        <TaskInput
          v-model="responsible"
          v-bind="responsibleAttrs"
          label="Responsável"
          placeholder="Digite o responsável"
          required
          :error="errors.responsible"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <TaskInput
          v-model="startDate"
          v-bind="startDateAttrs"
          label="Data de início"
          type="date"
          required
          :error="errors.startDate"
        />

        <TaskSelect
          v-model="status"
          v-bind="statusAttrs"
          label="Status"
          placeholder="Selecione o status"
          :options="statusOptions"
          required
          :error="errors.status"
        />
      </div>

      <TaskTextArea
        v-model="description"
        v-bind="descriptionAttrs"
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
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import TaskModal from '@/components/TaskModal.vue'
import TaskInput from '@/components/TaskInput.vue'
import TaskSelect from '@/components/TaskSelect.vue'
import TaskTextArea from '@/components/TaskTextArea.vue'
import type { ProjectFormData } from '@/types'

defineOptions({
  name: 'ProjectFormModal',
})

export type { ProjectFormData }

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'saved', payload: ProjectFormData): void
}>()

const statusOptions = [
  { label: 'Não Iniciado', value: 'Não Iniciado' },
  { label: 'Em andamento', value: 'Em andamento' },
  { label: 'Pausado', value: 'Pausado' },
  { label: 'Concluído', value: 'Concluído' },
]

const projectSchema = yup.object({
  name: yup.string().trim().required('Informe o nome do projeto.'),
  responsible: yup.string().trim().required('Informe o responsável.'),
  startDate: yup.string().required('Informe a data de início.'),
  status: yup.string().required('Selecione um status.'),
  description: yup.string().default(''),
})

const { errors, defineField, handleSubmit, resetForm } = useForm<ProjectFormData>({
  validationSchema: projectSchema,
  initialValues: {
    name: '',
    responsible: '',
    startDate: '',
    status: '',
    description: '',
  },
})

const [name, nameAttrs] = defineField('name')
const [responsible, responsibleAttrs] = defineField('responsible')
const [startDate, startDateAttrs] = defineField('startDate')
const [status, statusAttrs] = defineField('status')
const [description, descriptionAttrs] = defineField('description')

const loading = ref(false)

const onSubmit = handleSubmit(async (formValues) => {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    emit('saved', formValues)
    emit('update:modelValue', false)
    resetForm()
  } finally {
    loading.value = false
  }
})

function handleCancel() {
  resetForm()
}
</script>
