<template>
  <main class="flex min-h-screen items-center justify-center bg-white px-4">
    <div class="w-full max-w-sm">
      <h1 class="mb-8 text-center text-4xl font-light tracking-tight">
        <span class="text-primary font-semibold">Task</span><span class="text-slate-900">Flow</span>
      </h1>

      <section class="rounded-2xl bg-white p-8 shadow-lg shadow-slate-200/80">
        <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
          <TaskInput
            v-model="form.username"
            id="username"
            name="username"
            label="Usuário"
            type="text"
            autocomplete="username"
            placeholder="Informe seu e-mail"
            required
            :error="usernameError"
            @blur="markTouched('username')"
            @enter="onEnter"
          />

          <TaskInput
            v-model="form.password"
            id="password"
            name="password"
            label="Senha"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="Informe sua senha"
            required
            :error="passwordError"
            @blur="markTouched('password')"
            @enter="onEnter"
          >
            <template #append>
              <button
                type="button"
                class="pointer-events-auto rounded-lg px-2 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-50"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Ocultar' : 'Mostrar' }}
              </button>
            </template>
          </TaskInput>

          <div class="mt-2">
            <TaskButton
              button-type="submit"
              full-width
              :loading="loading"
              :disabled="isSubmitDisabled"
            >
              Acessar
            </TaskButton>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import TaskInput from '@/components/TaskInput.vue'
import TaskButton from '@/components/TaskButton.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

defineOptions({
  name: 'LoginPage',
})

type FieldName = 'username' | 'password'

const form = reactive({
  username: '',
  password: '',
})

const touched = reactive<Record<FieldName, boolean>>({
  username: false,
  password: false,
})

const submitted = ref(false)
const loading = ref(false)
const showPassword = ref(false)

const usernameError = computed(() => {
  if (!touched.username && !submitted.value) return ''
  if (!form.username.trim()) return 'Informe o usuário.'
  return ''
})

const passwordError = computed(() => {
  if (!touched.password && !submitted.value) return ''
  if (!form.password) return 'Informe a senha.'
  if (form.password.length < 8) return 'A senha deve ter ao menos 8 caracteres.'
  return ''
})

const hasErrors = computed(() => Boolean(usernameError.value || passwordError.value))

const isSubmitDisabled = computed(
  () => loading.value || !form.username || !form.password || hasErrors.value,
)

function markTouched(field: FieldName) {
  touched[field] = true
}

function onEnter() {
  if (!isSubmitDisabled.value) {
    void handleSubmit()
  }
}

async function handleSubmit() {
  submitted.value = true
  touched.username = true
  touched.password = true

  if (hasErrors.value) {
    return
  }

  loading.value = true

  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push({ name: 'home' })
  } finally {
    loading.value = false
  }
}
</script>
