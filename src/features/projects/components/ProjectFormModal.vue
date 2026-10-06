<template>
  <TaskModal
    :model-value="modelValue"
    :title="modalTitle"
    :subtitle="modalSubtitle"
    confirm-label="Salvar"
    :loading="projectStore.saving"
    @update:model-value="emit('update:modelValue', $event)"
    @confirm="onSubmit"
    @cancel="handleCancel"
  >
    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <TaskInput
        v-model="name"
        v-bind="nameAttrs"
        label="Nome do projeto"
        placeholder="Digite o nome do projeto"
        required
        :error="errors.name"
      />
    </form>
  </TaskModal>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import TaskModal from '@/components/TaskModal.vue'
import TaskInput from '@/components/TaskInput.vue'
import type { ProjectFormData, ProjectItem } from '@/types'
import { projectSchema } from '@/validators'
import { useProjectStore } from '@/stores/project'
import { useToast } from '@/composables/useToast'

defineOptions({
  name: 'ProjectFormModal',
})

export type { ProjectFormData }

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    project?: ProjectItem | null
  }>(),
  {
    project: null,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'saved', payload: ProjectFormData): void
}>()

const projectStore = useProjectStore()
const { addToast } = useToast()

const isEditing = computed(() => Boolean(props.project?.id))
const modalTitle = computed(() => (isEditing.value ? 'Editar Projeto' : 'Novo Projeto'))
const modalSubtitle = computed(() =>
  isEditing.value ? 'Atualize o nome do projeto' : 'Preencha o nome para criar um novo projeto',
)

const { errors, defineField, handleSubmit, resetForm } = useForm<ProjectFormData>({
  validationSchema: projectSchema,
  initialValues: {
    name: '',
  },
})

const [name, nameAttrs] = defineField('name')

watch(
  () => [props.modelValue, props.project],
  ([isOpen]) => {
    if (isOpen) {
      resetForm({
        values: {
          name: props.project?.name ?? '',
        },
      })
    }
  },
  { immediate: true },
)

const onSubmit = handleSubmit(async (formValues) => {
  try {
    if (isEditing.value && props.project?.id) {
      await projectStore.updateProject(props.project.id, {
        name: formValues.name,
      })
      addToast('Projeto atualizado com sucesso!', 'success')
    } else {
      await projectStore.createProject({
        name: formValues.name,
      })
      addToast('Projeto criado com sucesso!', 'success')
    }
    emit('saved', formValues)
    emit('update:modelValue', false)
    resetForm()
  } catch (err: unknown) {
    const action = isEditing.value ? 'atualizar' : 'criar'
    const message = err instanceof Error ? err.message : `Erro ao ${action} projeto`
    addToast(message, 'error')
  }
})

function handleCancel() {
  resetForm()
  emit('update:modelValue', false)
}
</script>
