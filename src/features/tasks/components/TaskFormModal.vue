<template>
  <TaskModal
    :model-value="modelValue"
    title="Nova Tarefa"
    subtitle="Preencha os dados para criar uma nova tarefa"
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
          label="Nome da tarefa"
          placeholder="Digite o nome"
          required
          :error="errors.name"
        />

        <TaskSelect
          v-model="project"
          v-bind="projectAttrs"
          label="Projeto"
          placeholder="Selecione o projeto"
          :options="projectOptions"
          required
          :error="errors.project"
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
        placeholder="Descreva a tarefa"
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
import TaskModal from '@/components/TaskModal.vue'
import TaskInput from '@/components/TaskInput.vue'
import TaskSelect from '@/components/TaskSelect.vue'
import TaskTextArea from '@/components/TaskTextArea.vue'
import type { TaskFormData } from '@/types'
import { taskSchema } from '@/validators'

defineOptions({
  name: 'TaskFormModal',
})

export type { TaskFormData }

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'saved', payload: TaskFormData): void
}>()

const projectOptions = [{ label: 'Nome do projeto', value: 'project-1' }]

const statusOptions = [
  { label: 'Não Iniciada', value: 'Não Iniciada' },
  { label: 'Em andamento', value: 'Em andamento' },
  { label: 'Pausada', value: 'Pausada' },
  { label: 'Concluída', value: 'Concluída' },
]

const { errors, defineField, handleSubmit, resetForm } = useForm<TaskFormData>({
  validationSchema: taskSchema,
  initialValues: {
    name: '',
    project: '',
    startDate: '',
    status: '',
    description: '',
  },
})

const [name, nameAttrs] = defineField('name')
const [project, projectAttrs] = defineField('project')
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
