<template>
  <TaskModal
    :model-value="modelValue"
    :title="modalTitle"
    :subtitle="modalSubtitle"
    confirm-label="Salvar"
    :loading="statusTaskStore.saving"
    @update:model-value="emit('update:modelValue', $event)"
    @confirm="onSubmit"
    @cancel="handleCancel"
  >
    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <!-- Nome do Status -->
      <TaskInput
        v-model="name"
        v-bind="nameAttrs"
        label="Nome do status"
        placeholder="Digite o nome do status (ex: Em Revisão)"
        required
        :error="errors.name"
      />

      <!-- Slug / Identificador -->
      <TaskInput
        v-model="slug"
        v-bind="slugAttrs"
        label="Identificador (slug)"
        placeholder="Ex: em-revisao (opcional)"
        :error="errors.slug"
      />

      <!-- Ativo / Inativo -->
      <div class="flex items-center gap-3 pt-1">
        <label class="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
          <input
            v-model="active"
            type="checkbox"
            class="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
          />
          <span>Status ativo</span>
        </label>
      </div>
    </form>
  </TaskModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import TaskModal from '@/components/TaskModal.vue'
import TaskInput from '@/components/TaskInput.vue'
import type { StatusTask, StatusTaskFormData } from '@/types'
import { statusTaskSchema } from '@/validators'
import { useStatusTaskStore } from '@/stores/statusTask'
import { useToast } from '@/composables/useToast'

defineOptions({
  name: 'StatusTaskFormModal',
})

export type { StatusTaskFormData }

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    statusTask?: StatusTask | null
  }>(),
  {
    statusTask: null,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'saved'): void
}>()

const statusTaskStore = useStatusTaskStore()
const { addToast } = useToast()

const isEditing = computed(() => Boolean(props.statusTask?.id))
const modalTitle = computed(() => (isEditing.value ? 'Editar Status' : 'Novo Status'))
const modalSubtitle = computed(() =>
  isEditing.value
    ? 'Atualize as informações do status da atividade'
    : 'Preencha os campos para cadastrar um novo status de atividade',
)

const active = ref(true)

const { errors, defineField, handleSubmit, resetForm } = useForm<StatusTaskFormData>({
  validationSchema: statusTaskSchema,
  initialValues: {
    name: '',
    slug: '',
  },
})

const [name, nameAttrs] = defineField('name')
const [slug, slugAttrs] = defineField('slug')

watch(
  () => [props.modelValue, props.statusTask],
  ([isOpen]) => {
    if (isOpen) {
      if (props.statusTask) {
        resetForm({
          values: {
            name: props.statusTask.name ?? '',
            slug: props.statusTask.slug ?? '',
          },
        })
        active.value = props.statusTask.active !== false
      } else {
        resetForm({
          values: {
            name: '',
            slug: '',
          },
        })
        active.value = true
      }
    }
  },
  { immediate: true },
)

const onSubmit = handleSubmit(async (formValues) => {
  try {
    const payload = {
      name: formValues.name.trim(),
      slug: formValues.slug ? formValues.slug.trim() : undefined,
      active: active.value,
    }

    if (isEditing.value && props.statusTask?.id) {
      await statusTaskStore.updateStatusTask(props.statusTask.id, payload)
      addToast('Status atualizado com sucesso!', 'success')
    } else {
      await statusTaskStore.createStatusTask(payload)
      addToast('Status criado com sucesso!', 'success')
    }

    emit('saved')
    emit('update:modelValue', false)
    resetForm()
  } catch (err: unknown) {
    const action = isEditing.value ? 'atualizar' : 'criar'
    const message = err instanceof Error ? err.message : `Erro ao ${action} status`
    addToast(message, 'error')
  }
})

function handleCancel() {
  resetForm()
  emit('update:modelValue', false)
}
</script>
