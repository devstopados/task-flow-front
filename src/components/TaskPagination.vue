<template>
  <div
    v-if="lastPage > 1 || total > 0"
    class="flex flex-col items-center justify-between gap-4 border-t border-neutral/60 pt-4 sm:flex-row"
  >
    <div class="text-xs text-slate-500 sm:text-sm">
      Mostrando
      <span class="font-medium text-slate-700">{{ fromItem }}</span>
      a
      <span class="font-medium text-slate-700">{{ toItem }}</span>
      de
      <span class="font-medium text-slate-700">{{ total }}</span>
      items
    </div>

    <div v-if="lastPage > 1" class="flex items-center gap-1.5">
      <button
        type="button"
        class="inline-flex h-8 items-center justify-center rounded-lg border border-neutral px-2.5 text-xs font-medium text-slate-600 transition hover:bg-neutral/40 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:px-3 sm:text-sm cursor-pointer"
        :disabled="currentPage <= 1 || disabled"
        @click="goToPage(currentPage - 1)"
      >
        Anterior
      </button>

      <template v-for="(pageItem, index) in pageItems" :key="index">
        <button
          v-if="typeof pageItem === 'number'"
          type="button"
          class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition sm:h-9 sm:w-9 sm:text-sm cursor-pointer"
          :class="
            pageItem === currentPage
              ? 'bg-primary text-white shadow-xs'
              : 'border border-neutral text-slate-600 hover:bg-neutral/40'
          "
          :disabled="disabled"
          @click="goToPage(pageItem)"
        >
          {{ pageItem }}
        </button>
        <span v-else class="px-1 text-xs text-slate-400 sm:text-sm select-none">
          {{ pageItem }}
        </span>
      </template>

      <button
        type="button"
        class="inline-flex h-8 items-center justify-center rounded-lg border border-neutral px-2.5 text-xs font-medium text-slate-600 transition hover:bg-neutral/40 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:px-3 sm:text-sm cursor-pointer"
        :disabled="currentPage >= lastPage || disabled"
        @click="goToPage(currentPage + 1)"
      >
        Próximo
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'TaskPagination',
})

const props = withDefaults(
  defineProps<{
    currentPage: number
    lastPage: number
    perPage?: number
    total: number
    disabled?: boolean
  }>(),
  {
    perPage: 10,
    disabled: false,
  },
)

const emit = defineEmits<{
  (event: 'change', page: number): void
}>()

const fromItem = computed(() => {
  if (props.total === 0) return 0
  return (props.currentPage - 1) * props.perPage + 1
})

const toItem = computed(() => {
  if (props.total === 0) return 0
  return Math.min(props.currentPage * props.perPage, props.total)
})

const pageItems = computed<(number | string)[]>(() => {
  const current = props.currentPage
  const total = props.lastPage
  const delta = 1
  const range: number[] = []
  const rangeWithDots: (number | string)[] = []
  let l: number | undefined

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  for (const i of range) {
    if (l !== undefined) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
})

function goToPage(page: number) {
  if (page >= 1 && page <= props.lastPage && page !== props.currentPage && !props.disabled) {
    emit('change', page)
  }
}
</script>
