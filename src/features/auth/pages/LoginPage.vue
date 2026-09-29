<template>
  <main class="flex min-h-screen items-center justify-center bg-white px-4">
    <div class="w-full max-w-sm">
      <h1 class="mb-8 text-center text-4xl font-light tracking-tight">
        <span class="text-primary font-semibold">Task</span><span class="text-slate-900">Flow</span>
      </h1>

      <section class="rounded-2xl bg-white p-8 shadow-lg shadow-slate-200/80">
        <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
          <TaskInput
            v-model="form.email"
            id="email"
            name="email"
            label="E-mail"
            type="email"
            autocomplete="email"
            placeholder="Informe seu e-mail"
            required
            :error="emailError"
            @blur="markTouched('email')"
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
import { useRouter } from 'vue-router'
import TaskInput from '@/components/TaskInput.vue'
import TaskButton from '@/components/TaskButton.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { ApiError } from '@/api'

defineOptions({
  name: 'LoginPage',
})

const router = useRouter()
const authStore = useAuthStore()
const { addToast } = useToast()

type FieldName = 'email' | 'password'

const form = reactive({
  email: '',
  password: '',
})

const touched = reactive<Record<FieldName, boolean>>({
  email: false,
  password: false,
})

const submitted = ref(false)
const loading = ref(false)
const showPassword = ref(false)

const emailError = computed(() => {
  if (!touched.email && !submitted.value) return ''
  const trimmed = form.email.trim()
  if (!trimmed) return 'Informe seu e-mail.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Informe um e-mail válido.'
  return ''
})

const passwordError = computed(() => {
  if (!touched.password && !submitted.value) return ''
  if (!form.password) return 'Informe a senha.'
  if (form.password.length < 8) return 'A senha deve ter ao menos 8 caracteres.'
  return ''
})

const hasErrors = computed(() => Boolean(emailError.value || passwordError.value))

const isSubmitDisabled = computed(
  () => loading.value || !form.email || !form.password || hasErrors.value,
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
  touched.email = true
  touched.password = true

  if (hasErrors.value) {
    return
  }

  loading.value = true

  try {
    const response = await authStore.login({
      email: form.email.trim(),
      password: form.password,
    })

    addToast(response.message || 'Login realizado com sucesso!', 'success')
    router.push({ name: 'home' })
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      if (err.errors) {
        const errorMessages = Object.values(err.errors).flat()
        addToast(errorMessages[0] || err.message, 'error')
      } else {
        addToast(err.message, 'error')
      }
    } else if (err instanceof Error) {
      addToast(err.message, 'error')
    } else {
      addToast('Ocorreu um erro ao realizar o login. Tente novamente.', 'error')
    }
  } finally {
    loading.value = false
  }
}
</script>
