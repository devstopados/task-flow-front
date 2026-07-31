<script setup lang="ts">
import { computed } from "vue";

type NotificationType = "error" | "success" | "info" | "warning";

defineOptions({
  name: "TaskNotification",
});

const props = defineProps<{
  type: NotificationType;
  title?: string;
  subtitle?: string;
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const defaultMessages: Record<NotificationType, { title: string; subtitle: string }> = {
  error: {
    title: "Erro!",
    subtitle: "Não foi possível realizar a operação.",
  },
  success: {
    title: "Sucesso!",
    subtitle: "Operação realizada com sucesso.",
  },
  info: {
    title: 'Informação!',
    subtitle: 'Confira os detalhes da operação.',
  },
  warning: {
    title: 'Atenção!',
    subtitle: 'Verifique as informações antes de continuar.',
  },
};

const displayTitle = computed(() => props.title ?? defaultMessages[props.type].title);
const displaySubtitle = computed(() => props.subtitle ?? defaultMessages[props.type].subtitle);

const typeClasses: Record<NotificationType, string> = {
  error: "bg-danger text-white",
  success: "bg-sucess text-white",
  info: "bg-info text-white",
  warning: "bg-warning text-white",
};

function handleClose(): void {
  emit("close");
}
</script>

<template>
  <div
    role="alert"
    aria-live="polite"
    aria-atomic="true"
    :class="['flex p-6 items-start gap-4 rounded-xl shadow-lg', typeClasses[type]]"
  >
    <div class="flex flex-1 flex-col gap-2">
      <p class="font-bold leading-tight">
        {{ displayTitle }}
      </p>
      <p v-if="displaySubtitle" class="text-sm opacity-90">
        {{ displaySubtitle }}
      </p>
    </div>

    <button
      type="button"
      class="absolute right-3 top-3 cursor-pointer rounded-lg p-1 opacity-80 transition hover:opacity-100"
      aria-label="Fechar notificação"
      @click="handleClose"
    >
      <svg
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  </div>
</template>
