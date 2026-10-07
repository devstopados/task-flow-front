<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSearch">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <TaskInput
        v-model="form.search"
        label="Nome ou Código"
        placeholder="Digite o nome ou código da tarefa"
      />

      <TaskSelect
        v-model="subprojectIdValue"
        label="Subprojeto"
        placeholder="Todos os subprojetos"
        :options="subprojectOptions"
        clearable
      />

      <TaskSelect
        v-model="statusIdValue"
        label="Status"
        placeholder="Todos os status"
        :options="statusFilterOptions"
        clearable
      />
    </div>

    <div class="flex items-center justify-end gap-3">
      <TaskButton variant="secondary" type="button" @click="handleClear">
        Limpar
      </TaskButton>
      <TaskButton type="submit" @click="handleSearch">
        Pesquisar
      </TaskButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import TaskInput from '@/components/TaskInput.vue'
import TaskSelect from '@/components/TaskSelect.vue'
import TaskButton from '@/components/TaskButton.vue'
import type { TaskFilterValues, Subproject } from '@/types'
import { subprojectService } from '@/services/subprojectService'
import { useStatusTaskStore } from '@/stores/statusTask'

defineOptions({
  name: 'TasksFilter',
})

export type { TaskFilterValues }

const emit = defineEmits<{
  (event: 'search', filters: TaskFilterValues): void
  (event: 'clear'): void
}>()

const statusTaskStore = useStatusTaskStore()
const subprojects = ref<Subproject[]>([])

const statusFilterOptions = computed(() => [
  { label: 'Todos os status', value: '' },
  ...statusTaskStore.statusTasks.map((opt) => ({
    label: opt.name,
    value: String(opt.id),
  })),
])

const subprojectOptions = computed(() => [
  { label: 'Todos os subprojetos', value: '' },
  ...subprojects.value.map((sub) => ({
    label: sub.name,
    value: String(sub.id),
  })),
])

const form = reactive<TaskFilterValues>({
  search: '',
  subproject_id: '',
  status_id: '',
})

const subprojectIdValue = computed({
  get: () => (form.subproject_id !== undefined && form.subproject_id !== null ? String(form.subproject_id) : ''),
  set: (val: string) => {
    form.subproject_id = val ? Number(val) : ''
  },
})

const statusIdValue = computed({
  get: () => (form.status_id !== undefined && form.status_id !== null ? String(form.status_id) : ''),
  set: (val: string) => {
    form.status_id = val ? Number(val) : ''
  },
})

async function loadSubprojects() {
  try {
    const response = await subprojectService.getSubprojects({ per_page: 100 })
    subprojects.value = Array.isArray(response.data) ? response.data : []
  } catch {
    subprojects.value = []
  }
}

onMounted(() => {
  loadSubprojects()
})

function handleSearch() {
  emit('search', { ...form })
}

function handleClear() {
  form.search = ''
  form.subproject_id = ''
  form.status_id = ''
  emit('clear')
}
</script>
