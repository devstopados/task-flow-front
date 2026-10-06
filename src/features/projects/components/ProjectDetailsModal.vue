<template>
  <TaskModal
    :model-value="modelValue"
    title="Detalhes do Projeto"
    :subtitle="modalSubtitle"
    size="lg"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex flex-col gap-5">
      <!-- Informações do Projeto -->
      <div
        class="flex items-center justify-between rounded-xl border border-neutral/60 bg-neutral/20 p-4"
      >
        <div>
          <span class="text-xs font-medium uppercase tracking-wider text-slate-400">
            Nome do Projeto
          </span>
          <h3 class="mt-1 text-base font-semibold text-primary sm:text-lg">
            {{ project?.name ?? '—' }}
          </h3>
          <p v-if="project?.id" class="mt-0.5 text-xs text-slate-500">
            Código: <span class="font-medium text-slate-700">#{{ project.id }}</span>
          </p>
        </div>

        <span
          v-if="project"
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
          :class="
            project.active !== false
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-slate-100 text-slate-500'
          "
        >
          <span
            class="h-1.5 w-1.5 rounded-full"
            :class="project.active !== false ? 'bg-emerald-500' : 'bg-slate-400'"
          />
          {{ project.active !== false ? 'Ativo' : 'Inativo' }}
        </span>
      </div>

      <!-- Lista de Subprojetos -->
      <div>
        <div class="mb-3 pb-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h4 class="text-sm font-semibold text-secondary">Subprojetos Vinculados</h4>
            <span
              v-if="!loading"
              class="inline-flex h-5 items-center justify-center rounded-full bg-neutral px-2 text-xs font-semibold text-primary"
            >
              {{ subprojects.length }}
            </span>
          </div>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-8 text-slate-500">
          <div class="flex items-center gap-2">
            <svg
              class="h-4 w-4 animate-spin text-primary"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.2" />
              <path
                d="M22 12a10 10 0 0 0-10-10"
                stroke="currentColor"
                stroke-width="4"
                stroke-linecap="round"
              />
            </svg>
            <span class="text-xs font-medium">Carregando subprojetos...</span>
          </div>
        </div>

        <div
          v-else-if="subprojects.length === 0"
          class="rounded-xl border border-dashed border-neutral p-6 text-center text-xs text-slate-400 sm:text-sm"
        >
          Nenhum subprojeto vinculado a este projeto.
        </div>

        <div v-else class="divide-y divide-neutral/50 rounded-xl border border-neutral">
          <div
            v-for="subproject in subprojects"
            :key="subproject.id"
            class="flex items-center justify-between p-3 transition hover:bg-neutral/15"
          >
            <div class="flex items-center gap-3">
              <span
                class="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral/50 text-xs font-semibold text-primary"
              >
                #{{ subproject.id }}
              </span>
              <span class="text-sm font-medium text-slate-700">
                {{ subproject.name }}
              </span>
            </div>

            <div class="flex items-center gap-3">
              <span
                class="rounded-full px-2 py-0.5 text-xs font-medium"
                :class="
                  subproject.active !== false
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                "
              >
                {{ subproject.active !== false ? 'Ativo' : 'Inativo' }}
              </span>

              <div class="flex items-center gap-1 border-l border-neutral/60 pl-2">
                <button
                  type="button"
                  class="rounded p-1 text-slate-400 transition hover:text-primary cursor-pointer"
                  title="Editar subprojeto"
                  @click="openEditSubproject(subproject)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  class="rounded p-1 transition cursor-pointer"
                  :class="
                    subproject.active !== false
                      ? 'text-slate-400 hover:text-danger'
                      : 'text-slate-400 hover:text-emerald-600'
                  "
                  :title="
                    subproject.active !== false ? 'Desativar subprojeto' : 'Ativar subprojeto'
                  "
                  @click="handleToggleActive(subproject)"
                >
                  <svg
                    v-if="subproject.active !== false"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end">
        <TaskButton variant="secondary" @click="close"> Fechar </TaskButton>
      </div>
    </template>
  </TaskModal>

  <!-- Modal de Edição de Subprojeto -->
  <TaskModal
    v-model="showEditModal"
    title="Editar Subprojeto"
    confirm-label="Salvar"
    :loading="savingEdit"
    @confirm="saveEditSubproject"
    @cancel="showEditModal = false"
  >
    <form class="flex flex-col gap-4" @submit.prevent="saveEditSubproject">
      <TaskInput
        v-model="editName"
        label="Nome do subprojeto"
        placeholder="Digite o novo nome"
        required
        :error="editError"
      />
    </form>
  </TaskModal>

  <!-- Modal de Confirmação de Ativação/Desativação -->
  <TaskConfirmModal
    v-model="showToggleModal"
    :title="subprojectToToggle?.active !== false ? 'Desativar Subprojeto' : 'Ativar Subprojeto'"
    :confirm-label="subprojectToToggle?.active !== false ? 'Desativar' : 'Ativar'"
    :variant="subprojectToToggle?.active !== false ? 'danger' : 'primary'"
    :loading="savingToggle"
    :description="
      subprojectToToggle?.active !== false
        ? 'O subprojeto ficará inativo no sistema até ser reativado.'
        : 'O subprojeto voltará a ficar ativo no sistema.'
    "
    @confirm="confirmToggleActive"
    @cancel="showToggleModal = false"
  >
    <p v-if="subprojectToToggle" class="text-sm text-slate-600">
      Deseja realmente {{ subprojectToToggle.active !== false ? 'desativar' : 'ativar' }} o
      subprojeto
      <strong class="font-semibold text-slate-800">"{{ subprojectToToggle.name }}"</strong>?
    </p>
  </TaskConfirmModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import TaskModal from '@/components/TaskModal.vue'
import TaskConfirmModal from '@/components/TaskConfirmModal.vue'
import TaskInput from '@/components/TaskInput.vue'
import TaskButton from '@/components/TaskButton.vue'
import type { ProjectItem, Subproject } from '@/types'
import { subprojectService } from '@/services/subprojectService'
import { useToast } from '@/composables/useToast'

defineOptions({
  name: 'ProjectDetailsModal',
})

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
}>()

const { addToast } = useToast()

const loading = ref(false)
const subprojects = ref<Subproject[]>([])

const showEditModal = ref(false)
const editingSubproject = ref<Subproject | null>(null)
const editName = ref('')
const editError = ref('')
const savingEdit = ref(false)

const showToggleModal = ref(false)
const subprojectToToggle = ref<Subproject | null>(null)
const savingToggle = ref(false)

const modalSubtitle = computed(() =>
  props.project?.name ? `Informações e subprojetos do projeto` : undefined,
)

async function loadSubprojects(projectId: number) {
  loading.value = true
  try {
    const response = await subprojectService.getSubprojects({
      project_id: projectId,
      per_page: 50,
    })
    subprojects.value = Array.isArray(response.data) ? response.data : []
  } catch {
    subprojects.value = []
  } finally {
    loading.value = false
  }
}

function openEditSubproject(subproject: Subproject) {
  editingSubproject.value = subproject
  editName.value = subproject.name
  editError.value = ''
  showEditModal.value = true
}

async function saveEditSubproject() {
  if (!editName.value.trim()) {
    editError.value = 'Informe o nome do subprojeto.'
    return
  }

  if (!editingSubproject.value) return

  savingEdit.value = true
  try {
    await subprojectService.updateSubproject(editingSubproject.value.id, {
      name: editName.value.trim(),
    })
    addToast('Subprojeto atualizado com sucesso!', 'success')
    showEditModal.value = false
    if (props.project?.id) {
      await loadSubprojects(props.project.id)
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar subprojeto'
    addToast(message, 'error')
  } finally {
    savingEdit.value = false
  }
}

function handleToggleActive(subproject: Subproject) {
  subprojectToToggle.value = subproject
  showToggleModal.value = true
}

async function confirmToggleActive() {
  if (!subprojectToToggle.value) return

  const target = subprojectToToggle.value
  const newActive = target.active === false
  const actionText = newActive ? 'ativar' : 'desativar'

  savingToggle.value = true
  try {
    await subprojectService.updateSubproject(target.id, {
      active: newActive,
    })
    target.active = newActive
    addToast(`Subprojeto ${newActive ? 'ativado' : 'desativado'} com sucesso!`, 'success')
    showToggleModal.value = false
    if (props.project?.id) {
      await loadSubprojects(props.project.id)
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : `Erro ao ${actionText} subprojeto`
    addToast(message, 'error')
  } finally {
    savingToggle.value = false
  }
}

watch(
  () => [props.modelValue, props.project],
  ([isOpen]) => {
    if (isOpen && props.project?.id) {
      loadSubprojects(props.project.id)
    } else if (!isOpen) {
      subprojects.value = []
    }
  },
  { immediate: true },
)

function close() {
  emit('update:modelValue', false)
}
</script>
