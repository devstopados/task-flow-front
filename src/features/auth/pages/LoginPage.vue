<template>
  <main class="flex min-h-screen items-center justify-center bg-white px-4">
    <div class="w-full max-w-sm">
      <h1 class="mb-8 text-center text-4xl font-light tracking-tight">
        <span class="text-primary font-semibold">Task</span><span class="text-slate-900">Flow</span>
      </h1>

      <section class="rounded-2xl bg-white p-8 shadow-lg shadow-slate-200/80">
        <form class="flex flex-col gap-5" @submit.prevent="onSubmit">
          <TaskInput
            v-model="email"
            v-bind="emailAttrs"
            id="email"
            label="E-mail"
            type="email"
            autocomplete="email"
            placeholder="Informe seu e-mail"
            required
            :error="errors.email"
          />

          <TaskInput
            v-model="password"
            v-bind="passwordAttrs"
            id="password"
            label="Senha"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="Informe sua senha"
            required
            :error="errors.password"
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
            <TaskButton button-type="submit" full-width :loading="loading"> Acessar </TaskButton>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useForm } from 'vee-validate'
import TaskInput from '@/components/TaskInput.vue'
import TaskButton from '@/components/TaskButton.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { ApiError } from '@/api'
import { loginSchema } from '@/validators'

defineOptions({
  name: 'LoginPage',
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { addToast } = useToast()

const loading = ref(false)
const showPassword = ref(false)

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: loginSchema,
  initialValues: {
    email: '',
    password: '',
  },
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (formValues) => {
  loading.value = true

  try {
    const response = await authStore.login({
      email: formValues.email.trim(),
      password: formValues.password,
    })

    addToast(response.message || 'Login realizado com sucesso!', 'success')
    const redirectPath = typeof route.query.redirect === 'string' ? route.query.redirect : null
    if (redirectPath) {
      router.push(redirectPath)
    } else {
      router.push({ name: 'home' })
    }
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
})
</script>
