<template>
  <div class="rounded-xl border border-neutral bg-white p-6">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'TaskCard',
})
</script>
