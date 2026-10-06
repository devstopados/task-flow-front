<template>
  <TaskModal
    :model-value="modelValue"
    title="Novo Subprojeto"
    :subtitle="modalSubtitle"
    confirm-label="Salvar"
    :loading="subprojectStore.saving"
    @update:model-value="emit('update:modelValue', $event)"
    @confirm="onSubmit"
    @cancel="handleCancel"
  >
    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <div v-if="project" class="rounded-lg bg-neutral/30 px-3 py-2 text-xs text-slate-600">
        Projeto vinculado: <span class="font-semibold text-primary">{{ project.name }}</span>
      </div>

      <TaskInput
        v-model="name"
        v-bind="nameAttrs"
        label="Nome do subprojeto"
        placeholder="Digite o nome do subprojeto"
        required
        :error="errors.name"
      />
    </form>
  </TaskModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import TaskModal from '@/components/TaskModal.vue'
import TaskInput from '@/components/TaskInput.vue'
import type { SubprojectFormData, ProjectItem } from '@/types'
import { subprojectSchema } from '@/validators'
import { useSubprojectStore } from '@/stores/subproject'
import { useToast } from '@/composables/useToast'

defineOptions({
  name: 'SubprojectFormModal',
})

export type { SubprojectFormData }

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
  (event: 'saved', payload: SubprojectFormData): void
}>()

const subprojectStore = useSubprojectStore()
const { addToast } = useToast()

const storedProjectId = ref<number | null>(null)

const modalSubtitle = computed(() =>
  props.project?.name
    ? `Vincular novo subprojeto a "${props.project.name}"`
    : 'Preencha o nome para criar o subprojeto',
)

const { errors, defineField, handleSubmit, resetForm } = useForm<SubprojectFormData>({
  validationSchema: subprojectSchema,
  initialValues: {
    name: '',
  },
})

const [name, nameAttrs] = defineField('name')

watch(
  () => [props.modelValue, props.project],
  ([isOpen]) => {
    if (isOpen) {
      storedProjectId.value = props.project?.id ?? null
      resetForm({
        values: {
          name: '',
        },
      })
    }
  },
  { immediate: true },
)

const onSubmit = handleSubmit(async (formValues) => {
  if (!storedProjectId.value) {
    addToast('Identificador do projeto não encontrado.', 'error')
    return
  }

  try {
    await subprojectStore.createSubproject({
      project_id: storedProjectId.value,
      name: formValues.name,
      active: true,
    })
    addToast('Subprojeto criado com sucesso!', 'success')
    emit('saved', {
      project_id: storedProjectId.value,
      name: formValues.name,
      active: true,
    })
    emit('update:modelValue', false)
    resetForm()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao criar subprojeto'
    addToast(message, 'error')
  }
})

function handleCancel() {
  resetForm()
  emit('update:modelValue', false)
}
</script>
