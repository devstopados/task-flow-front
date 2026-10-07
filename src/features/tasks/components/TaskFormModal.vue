<template>
  <TaskModal
    :model-value="modelValue"
    :title="isEdit ? 'Editar Tarefa' : 'Nova Tarefa'"
    :subtitle="
      isEdit ? 'Altere as informações da tarefa' : 'Preencha os dados para criar uma nova tarefa'
    "
    :confirm-label="isEdit ? 'Salvar Alterações' : 'Criar Tarefa'"
    :loading="loading"
    size="lg"
    @update:model-value="emit('update:modelValue', $event)"
    @confirm="onSubmit"
    @cancel="handleCancel"
  >
    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <!-- Linha 1: Nome e Código -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="sm:col-span-2">
          <TaskInput
            v-model="name"
            v-bind="nameAttrs"
            label="Nome da tarefa"
            placeholder="Digite o nome da tarefa"
            required
            :error="errors.name"
          />
        </div>
        <div>
          <TaskInput
            v-model="code"
            v-bind="codeAttrs"
            label="Código"
            placeholder="Ex: TASK-01"
            :error="errors.code"
          />
        </div>
      </div>

      <!-- Linha 2: Subprojeto e Status -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <TaskSelect
            v-model="subprojectIdValue"
            label="Subprojeto"
            placeholder="Selecione um subprojeto"
            :options="subprojectOptions"
            required
            :error="errors.subproject_id"
          />
        </div>

        <div>
          <TaskSelect
            v-model="statusIdValue"
            label="Status"
            placeholder="Selecione o status"
            :options="statusOptions"
            :disabled="statusTaskStore.loading"
            required
            :error="errors.status_id"
          />
        </div>
      </div>

      <!-- Linha 3: Data de Início, Data de Término e Horas -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <TaskInput
            v-model="startDate"
            v-bind="startDateAttrs"
            label="Data de início"
            type="date"
            :error="errors.start_date"
          />
        </div>

        <div>
          <TaskInput
            v-model="endDate"
            v-bind="endDateAttrs"
            label="Data de conclusão"
            type="date"
            :error="errors.end_date"
          />
        </div>

        <div>
          <TaskInput
            v-model="hours"
            v-bind="hoursAttrs"
            label="Horas estimadas / gastas"
            type="number"
            step="0.25"
            min="0"
            placeholder="Ex: 8.0"
            :error="errors.hours"
          />
        </div>
      </div>

      <!-- Linha 4: Branch e Link -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <TaskInput
            v-model="branch"
            v-bind="branchAttrs"
            label="Branch / Repositório"
            placeholder="Ex: feature/auth-login"
            :error="errors.branch"
          />
        </div>

        <div>
          <TaskInput
            v-model="link"
            v-bind="linkAttrs"
            label="Link / Pull Request"
            placeholder="Ex: https://github.com/..."
            :error="errors.link"
          />
        </div>
      </div>
    </form>
  </TaskModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import TaskModal from '@/components/TaskModal.vue'
import TaskInput from '@/components/TaskInput.vue'
import TaskSelect from '@/components/TaskSelect.vue'
import type { Task, Subproject } from '@/types'
import { taskSchema } from '@/validators'
import { useTaskStore } from '@/stores/task'
import { useStatusTaskStore } from '@/stores/statusTask'
import { subprojectService } from '@/services/subprojectService'
import { useToast } from '@/composables/useToast'

defineOptions({
  name: 'TaskFormModal',
})

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    task?: Task | null
  }>(),
  {
    task: null,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'saved'): void
}>()

const taskStore = useTaskStore()
const statusTaskStore = useStatusTaskStore()
const { addToast } = useToast()

const isEdit = computed(() => Boolean(props.task?.id))
const loading = computed(() => taskStore.saving)

const subprojects = ref<Subproject[]>([])
const loadingSubprojects = ref(false)

const statusOptions = computed(() => {
  return statusTaskStore.statusTasks.map((opt) => ({
    label: opt.name,
    value: String(opt.id),
  }))
})

const subprojectOptions = computed(() => {
  return subprojects.value.map((sub) => ({
    label: sub.project?.name ? `${sub.project.name} > ${sub.name}` : sub.name,
    value: String(sub.id),
  }))
})

async function loadSubprojectsList() {
  loadingSubprojects.value = true
  try {
    const response = await subprojectService.getSubprojects({ per_page: 100 })
    subprojects.value = Array.isArray(response.data) ? response.data : []
  } catch {
    subprojects.value = []
  } finally {
    loadingSubprojects.value = false
  }
}

interface FormValues {
  name: string
  code: string
  subproject_id: number | null
  status_id: number
  start_date: string
  end_date: string
  hours: number | null
  branch: string
  link: string
}

const { errors, defineField, handleSubmit, resetForm, setValues } = useForm<FormValues>({
  validationSchema: taskSchema,
  initialValues: {
    name: '',
    code: '',
    subproject_id: null,
    status_id: 1,
    start_date: '',
    end_date: '',
    hours: null,
    branch: '',
    link: '',
  },
})

const [name, nameAttrs] = defineField('name')
const [code, codeAttrs] = defineField('code')
const [subprojectId] = defineField('subproject_id')
const [statusId] = defineField('status_id')
const [startDate, startDateAttrs] = defineField('start_date')
const [endDate, endDateAttrs] = defineField('end_date')
const [hours, hoursAttrs] = defineField('hours')
const [branch, branchAttrs] = defineField('branch')
const [link, linkAttrs] = defineField('link')

const subprojectIdValue = computed({
  get: () => (subprojectId.value ? String(subprojectId.value) : ''),
  set: (val: string) => {
    subprojectId.value = val ? Number(val) : null
  },
})

const statusIdValue = computed({
  get: () => (statusId.value ? String(statusId.value) : ''),
  set: (val: string) => {
    statusId.value = val ? Number(val) : 0
  },
})

function formatDateForInput(dateStr?: string | null): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    return d.toISOString().split('T')[0] ?? ''
  } catch {
    return ''
  }
}

watch(
  () => [props.modelValue, props.task],
  ([isOpen]) => {
    if (isOpen) {
      loadSubprojectsList()

      if (props.task) {
        setValues({
          name: props.task.name ?? '',
          code: props.task.code ?? '',
          subproject_id: props.task.subproject_id ?? null,
          status_id: props.task.status_id ?? statusTaskStore.statusTasks[0]?.id ?? 1,
          start_date: formatDateForInput(props.task.start_date),
          end_date: formatDateForInput(props.task.end_date),
          hours: props.task.hours ?? null,
          branch: props.task.branch ?? '',
          link: props.task.link ?? '',
        })
      } else {
        const defaultStatusId = statusTaskStore.statusTasks[0]?.id ?? 1
        resetForm({
          values: {
            name: '',
            code: '',
            subproject_id: null,
            status_id: defaultStatusId,
            start_date: new Date().toISOString().split('T')[0],
            end_date: '',
            hours: null,
            branch: '',
            link: '',
          },
        })
      }
    }
  },
  { immediate: true },
)

const onSubmit = handleSubmit(async (values) => {
  try {
    const payload = {
      name: values.name.trim(),
      code: values.code ? values.code.trim() : undefined,
      subproject_id: Number(values.subproject_id),
      status_id: Number(values.status_id) || 1,
      start_date: values.start_date || undefined,
      end_date: values.end_date || undefined,
      hours: values.hours !== null && values.hours !== undefined ? Number(values.hours) : null,
      branch: values.branch ? values.branch.trim() : undefined,
      link: values.link ? values.link.trim() : undefined,
    }

    if (isEdit.value && props.task?.id) {
      await taskStore.updateTask(props.task.id, payload)
      addToast('Tarefa atualizada com sucesso!', 'success')
    } else {
      await taskStore.createTask(payload)
      addToast('Tarefa criada com sucesso!', 'success')
    }

    emit('saved')
    emit('update:modelValue', false)
    resetForm()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao salvar tarefa'
    addToast(message, 'error')
  }
})

function handleCancel() {
  emit('update:modelValue', false)
  resetForm()
}
</script>
