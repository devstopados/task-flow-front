<template>
  <aside class="flex h-screen w-56 flex-col bg-primary text-white">
    <div class="flex h-16 items-center justify-center border-b border-white/10">
      <h1 class="text-xl font-light tracking-tight">
        <span class="font-semibold">Task</span><span class="font-light">Flow</span>
      </h1>
    </div>

    <nav class="flex-1 px-3 py-4">
      <ul class="flex flex-col gap-1">
        <li v-for="item in menuItems" :key="item.name">
          <router-link
            :to="item.to"
            class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-white/10"
            active-class="bg-white/15"
          >
            <component :is="item.icon" class="h-5 w-5 shrink-0" />
            {{ item.label }}
          </router-link>
        </li>

        <li>
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-white/10"
            @click="handleLogout"
          >
            <LogoutIcon class="h-5 w-5 shrink-0" />
            Sair
          </button>
        </li>
      </ul>
    </nav>

    <div class="border-t border-white/10 px-4 py-4">
      <p class="text-sm font-semibold leading-tight">Usuário 01</p>
      <p class="text-xs leading-tight text-white/70">usuário@gmail.com</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { h, type FunctionalComponent } from 'vue'
import type { MenuItem } from '@/composables/useMenu'

defineOptions({
  name: 'TaskSideBar',
})

defineProps<{
  menuItems: MenuItem[]
}>()

const emit = defineEmits<{
  (event: 'logout'): void
}>()

const LogoutIcon: FunctionalComponent = () =>
  h(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      'stroke-width': '1.5',
      stroke: 'currentColor',
    },
    [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        d: 'M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15',
      }),
    ],
  )

function handleLogout() {
  emit('logout')
}
</script>
