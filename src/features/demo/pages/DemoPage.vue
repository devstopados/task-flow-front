<template>
  <main class="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
    <section class="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header
        class="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-xl shadow-slate-200/60 sm:px-8"
      >
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">Taskflow UI</p>
        <h1 class="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Página de demonstração
        </h1>
        <p class="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          Exemplo prático dos componentes base criados para o projeto, com estados, validação e
          variações visuais no padrão Tailwind.
        </p>
      </header>

      <div class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section
          class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8"
        >
          <div class="mb-8 flex items-start justify-between gap-4">
            <div>
              <h2 class="text-2xl font-semibold tracking-tight text-slate-900">
                Formulário exemplo
              </h2>
              <p class="mt-2 text-sm text-slate-600">
                Mistura de input, select, radio, checkbox, textarea e botões.
              </p>
            </div>
            <TaskButton variant="tertiary" size="sm" @click="resetForm"> Limpar tudo </TaskButton>
          </div>

          <form class="grid gap-5" @submit.prevent="handleSubmit">
            <div class="grid gap-5 md:grid-cols-2">
              <TaskInput
                v-model="form.name"
                id="demo-name"
                name="name"
                label="Nome"
                placeholder="Digite seu nome"
                clearable
                :error="nameError"
                :hint="!nameError ? 'Campo de texto simples com validação.' : ''"
              />

              <TaskSelect
                v-model="form.team"
                id="demo-team"
                name="team"
                label="Equipe"
                placeholder="Selecione a equipe"
                :options="teamOptions"
                clearable
                :error="teamError"
                :hint="!teamError ? 'Select com opções simples e objetos.' : ''"
              />
            </div>

            <TaskRadio
              v-model="form.plan"
              id="demo-plan"
              name="plan"
              label="Plano"
              :options="planOptions"
              :error="planError"
              :hint="!planError ? 'Grupo de radio com orientação vertical.' : ''"
            />

            <TaskCheckbox
              v-model="form.acceptTerms"
              id="demo-terms"
              name="acceptTerms"
              label="Aceito os termos de uso"
              secondary-label="Checkbox individual com estado completo e feedback visual."
              :error="termsError"
              :hint="!termsError ? 'Obrigatório para continuar.' : ''"
            />

            <TaskTextArea
              v-model="form.description"
              id="demo-description"
              name="description"
              label="Descrição"
              placeholder="Descreva seu objetivo..."
              :max-length="160"
              :rows="5"
              :error="descriptionError"
              :hint="!descriptionError ? 'Textarea com contador e limite de caracteres.' : ''"
            />

            <div class="grid gap-3 sm:grid-cols-3">
              <TaskButton variant="primary" button-type="submit" full-width>
                Salvar exemplo
              </TaskButton>
              <TaskButton variant="secondary" full-width @click="fillExample">
                Preencher
              </TaskButton>
              <TaskButton variant="tertiary" full-width @click="resetForm"> Limpar </TaskButton>
            </div>
          </form>
        </section>

        <aside class="space-y-6">
          <section
            class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8"
          >
            <h2 class="text-xl font-semibold tracking-tight text-slate-900">Preview dos estados</h2>
            <div class="mt-5 grid gap-4">
              <div class="rounded-2xl bg-slate-50 p-4">
                <p class="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">Nome</p>
                <p class="mt-2 text-sm text-slate-800">{{ form.name || "Sem valor" }}</p>
              </div>
              <div class="rounded-2xl bg-slate-50 p-4">
                <p class="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">Equipe</p>
                <p class="mt-2 text-sm text-slate-800">{{ form.team || "Sem valor" }}</p>
              </div>
              <div class="rounded-2xl bg-slate-50 p-4">
                <p class="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">Plano</p>
                <p class="mt-2 text-sm text-slate-800">{{ form.plan || "Sem valor" }}</p>
              </div>
              <div class="rounded-2xl bg-slate-50 p-4">
                <p class="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">Termos</p>
                <p class="mt-2 text-sm text-slate-800">
                  {{ form.acceptTerms ? "Aceitos" : "Não aceitos" }}
                </p>
              </div>
              <div class="rounded-2xl bg-slate-50 p-4">
                <p class="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
                  Descrição
                </p>
                <p class="mt-2 text-sm text-slate-800">
                  {{ form.description || "Sem descrição" }}
                </p>
              </div>
            </div>
          </section>

          <section
            class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8"
          >
            <h2 class="text-xl font-semibold tracking-tight text-slate-900">Ações</h2>
            <div class="mt-5 flex flex-col gap-3">
              <TaskButton variant="primary" full-width :loading="loading">Primary</TaskButton>
              <TaskButton variant="secondary" full-width>Secondary</TaskButton>
              <TaskButton variant="tertiary" full-width>Tertiary</TaskButton>
            </div>
          </section>
        </aside>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import TaskButton from "@/components/TaskButton.vue";
import TaskCheckbox from "@/components/TaskCheckbox.vue";
import TaskInput from "@/components/TaskInput.vue";
import TaskRadio from "@/components/TaskRadio.vue";
import TaskSelect from "@/components/TaskSelect.vue";
import TaskTextArea from "@/components/TaskTextArea.vue";

defineOptions({
  name: "DemoPage",
});

const teamOptions = [
  "Produto",
  "Design",
  { label: "Engenharia", value: "engineering", description: "Back-end e front-end" },
  { label: "Operações", value: "operations" },
];

const planOptions = [
  { label: "Básico", value: "basic", description: "Ideal para começar" },
  { label: "Pro", value: "pro", description: "Mais recursos e automação" },
  { label: "Enterprise", value: "enterprise", description: "Escala e governança" },
];

const form = reactive({
  name: "",
  team: "",
  plan: "",
  acceptTerms: false,
  description: "",
});

const loading = ref(false);

const nameError = computed(() =>
  form.name.trim().length < 3 && form.name ? "Use ao menos 3 caracteres." : "",
);
const teamError = computed(() => (!form.team ? "Escolha uma equipe." : ""));
const planError = computed(() => (!form.plan ? "Escolha um plano." : ""));
const termsError = computed(() => (!form.acceptTerms ? "Você precisa aceitar os termos." : ""));
const descriptionError = computed(() =>
  form.description.length > 160 ? "Limite máximo de 160 caracteres." : "",
);

function fillExample() {
  form.name = "Ana Freitas";
  form.team = "engineering";
  form.plan = "pro";
  form.acceptTerms = true;
  form.description = "Quero usar essa tela para validar os componentes base do sistema.";
}

function resetForm() {
  form.name = "";
  form.team = "";
  form.plan = "";
  form.acceptTerms = false;
  form.description = "";
}

async function handleSubmit() {
  loading.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Demo payload", { ...form });
  } finally {
    loading.value = false;
  }
}
</script>
