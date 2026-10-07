<template>
  <TaskModal
    :model-value="modelValue"
    title="Detalhes da Tarefa"
    :subtitle="task?.name ? `Informações detalhadas de #${task.code || task.id}` : undefined"
    size="lg"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="task" class="flex flex-col gap-5">
      <!-- Cabeçalho da Tarefa: Nome, Código e Status -->
      <div
        class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral/60 bg-neutral/20 p-4"
      >
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center rounded-md bg-neutral px-2 py-0.5 text-xs font-semibold text-primary"
            >
              {{ task.code || `#${task.id}` }}
            </span>
            <span class="text-xs text-slate-400">ID #{{ task.id }}</span>
          </div>
          <h3 class="mt-1 text-base font-semibold text-primary sm:text-lg">
            {{ task.name }}
          </h3>
        </div>

        <span
          class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
          :class="statusBadgeClass"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass" />
          {{ statusLabel }}
        </span>
      </div>

      <!-- Detalhes em Grid -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <!-- Subprojeto Vinculado -->
        <div class="rounded-xl border border-neutral/50 p-3.5">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-400">
            Subprojeto Vinculado
          </span>
          <p class="mt-1 text-sm font-semibold text-secondary">
            {{ task.subproject?.name ?? (task.subproject_id ? `Subprojeto #${task.subproject_id}` : 'Nenhum') }}
          </p>
        </div>

        <!-- Horas -->
        <div class="rounded-xl border border-neutral/50 p-3.5">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-400">
            Horas Registradas
          </span>
          <p class="mt-1 text-sm font-semibold text-secondary">
            {{ task.hours !== null && task.hours !== undefined ? `${task.hours}h` : '—' }}
          </p>
        </div>

        <!-- Data de Início -->
        <div class="rounded-xl border border-neutral/50 p-3.5">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-400">
            Data de Início
          </span>
          <p class="mt-1 text-sm font-semibold text-secondary">
            {{ formatDate(task.start_date) }}
          </p>
        </div>

        <!-- Data de Conclusão -->
        <div class="rounded-xl border border-neutral/50 p-3.5">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-400">
            Data de Conclusão
          </span>
          <p class="mt-1 text-sm font-semibold text-secondary">
            {{ formatDate(task.end_date) }}
          </p>
        </div>

        <!-- Branch -->
        <div class="rounded-xl border border-neutral/50 p-3.5">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-400">
            Branch / Git
          </span>
          <p class="mt-1 font-mono text-xs font-medium text-slate-700">
            {{ task.branch || '—' }}
          </p>
        </div>

        <!-- Link / PR -->
        <div class="rounded-xl border border-neutral/50 p-3.5">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-400">
            Link Externo / PR
          </span>
          <p class="mt-1 truncate text-xs">
            <a
              v-if="task.link"
              :href="task.link"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 font-medium text-sky-600 hover:underline"
            >
              <span>{{ task.link }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-3 w-3 shrink-0"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
            <span v-else class="text-slate-400">—</span>
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end">
        <TaskButton variant="secondary" @click="close"> Fechar </TaskButton>
      </div>
    </template>
  </TaskModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TaskModal from '@/components/TaskModal.vue'
import TaskButton from '@/components/TaskButton.vue'
import type { Task } from '@/types'
import { TASK_STATUS_MAP } from '@/types'

defineOptions({
  name: 'TaskDetailsModal',
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
}>()

const statusLabel = computed(() => {
  if (!props.task) return '—'
  return TASK_STATUS_MAP[props.task.status_id]?.label ?? 'Desconhecido'
})

const statusBadgeClass = computed(() => {
  if (!props.task) return 'bg-slate-100 text-slate-600'
  return TASK_STATUS_MAP[props.task.status_id]?.badgeClass ?? 'bg-slate-100 text-slate-600'
})

const statusDotClass = computed(() => {
  if (!props.task) return 'bg-slate-400'
  switch (props.task.status_id) {
    case 2:
      return 'bg-sky-500'
    case 3:
      return 'bg-amber-500'
    case 4:
      return 'bg-emerald-500'
    case 1:
    default:
      return 'bg-slate-400'
  }
})

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('pt-BR')
  } catch {
    return dateStr
  }
}

function close() {
  emit('update:modelValue', false)
}
</script>
