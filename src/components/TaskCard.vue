<template>
  <div class="rounded-xl border border-neutral bg-white p-6">
    <div
      v-if="title || $slots.header || $slots.actions || collapsible"
      class="flex items-center justify-between"
      :class="[isCollapsed ? 'mb-0' : 'mb-1', collapsible ? 'cursor-pointer select-none' : '']"
      @click="collapsible && toggleCollapse()"
    >
      <slot name="header">
        <h2 v-if="title" class="text-lg font-semibold text-secondary">
          {{ title }}
        </h2>
      </slot>

      <div class="flex items-center gap-3">
        <div v-if="$slots.actions" class="flex items-center gap-3" @click.stop>
          <slot name="actions" />
        </div>

        <button
          v-if="collapsible"
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-neutral hover:text-primary cursor-pointer"
          :aria-expanded="!isCollapsed"
          :aria-label="isCollapsed ? 'Expandir card' : 'Recolher card'"
          @click.stop="toggleCollapse"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="h-5 w-5 transition-transform duration-200"
            :class="isCollapsed ? '-rotate-90' : 'rotate-0'"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>
    </div>

    <div v-show="!isCollapsed">
      <div v-if="title || $slots.header" class="py-4">
        <hr class="border-primary" />
      </div>

      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

defineOptions({
  name: 'TaskCard',
})

const props = withDefaults(
  defineProps<{
    title?: string
    collapsible?: boolean
    defaultCollapsed?: boolean
  }>(),
  {
    title: undefined,
    collapsible: false,
    defaultCollapsed: false,
  },
)

const collapsed = defineModel<boolean>('collapsed', { default: false })

const isCollapsed = ref(props.defaultCollapsed || collapsed.value)

watch(collapsed, (val) => {
  isCollapsed.value = val
})

function toggleCollapse() {
  if (!props.collapsible) return
  isCollapsed.value = !isCollapsed.value
  collapsed.value = isCollapsed.value
}
</script>
