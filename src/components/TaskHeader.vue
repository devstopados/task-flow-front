<template>
  <header class="mb-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-primary">
        <slot />
      </h1>

      <div v-if="$slots.actions" class="flex items-center gap-3">
        <slot name="actions" />
      </div>
    </div>

    <p v-if="$slots.description" class="mt-1 text-sm text-gray">
      <slot name="description" />
    </p>
  </header>
</template>

<script setup lang="ts">
defineOptions({
  name: 'TaskHeader',
})
</script>
