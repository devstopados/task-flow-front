<template>
  <aside class="sticky top-0 flex h-screen w-56 shrink-0 flex-col bg-primary text-white">
    <div class="flex h-16 items-center justify-center border-b border-white/10">
      <h1 class="text-xl font-light tracking-tight">
        <span class="font-semibold">Task</span><span class="font-light">Flow</span>
      </h1>
    </div>

    <nav class="flex-1 px-3 py-4">
      <ul class="flex flex-col gap-1">
        <li v-for="item in menuItems" :key="item.name">
          <!-- Item com link direto -->
          <router-link
            v-if="!item.children || item.children.length === 0"
            :to="item.to ?? '#'"
            class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-white/10"
            active-class="bg-white/15"
          >
            <component :is="item.icon" class="h-5 w-5 shrink-0" />
            {{ item.label }}
          </router-link>

          <!-- Item com submenu (Dropdown / Accordion) -->
          <div v-else class="flex flex-col">
            <button
              type="button"
              class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-white/10 cursor-pointer"
              :class="{
                'bg-white/10 text-white': isChildActive(item) || isExpanded(item.name),
                'text-white/90': !isChildActive(item) && !isExpanded(item.name),
              }"
              @click="toggleExpand(item.name)"
            >
              <div class="flex items-center gap-3">
                <component :is="item.icon" class="h-5 w-5 shrink-0" />
                <span>{{ item.label }}</span>
              </div>
              <svg
                class="h-4 w-4 shrink-0 transition-transform duration-200"
                :class="{ 'rotate-180': isExpanded(item.name) }"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            <!-- Lista do submenu -->
            <transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <ul v-if="isExpanded(item.name)" class="mt-1 flex flex-col gap-1 pl-7">
                <li v-for="child in item.children" :key="child.name">
                  <router-link
                    :to="child.to"
                    class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                    active-class="bg-white/20 !text-white font-semibold"
                  >
                    <span class="h-1.5 w-1.5 rounded-full bg-white/60"></span>
                    {{ child.label }}
                  </router-link>
                </li>
              </ul>
            </transition>
          </div>
        </li>

        <li>
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-white/10 cursor-pointer"
            @click="handleLogout"
          >
            <LogoutIcon class="h-5 w-5 shrink-0" />
            Sair
          </button>
        </li>
      </ul>
    </nav>

    <div class="border-t border-white/10 px-4 py-4">
      <p class="truncate text-sm font-semibold leading-tight">
        {{ authStore.user?.name || 'Usuário' }}
      </p>
      <p class="truncate text-xs leading-tight text-white/70">
        {{ authStore.user?.email || 'usuario@exemplo.com' }}
      </p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { h, ref, watch, type FunctionalComponent } from 'vue'
import { useRoute } from 'vue-router'
import type { MenuItem } from '@/composables/useMenu'
import { useAuthStore } from '@/stores/auth'

defineOptions({
  name: 'TaskSideBar',
})

const authStore = useAuthStore()
const route = useRoute()

const props = defineProps<{
  menuItems: MenuItem[]
}>()

const emit = defineEmits<{
  (event: 'logout'): void
}>()

const expandedItems = ref<Record<string, boolean>>({})

function isExpanded(name: string): boolean {
  return Boolean(expandedItems.value[name])
}

function toggleExpand(name: string) {
  expandedItems.value[name] = !expandedItems.value[name]
}

function isChildActive(item: MenuItem): boolean {
  if (!item.children || item.children.length === 0) return false
  return item.children.some((child) => route.path === child.to || route.path.startsWith(child.to + '/'))
}

watch(
  () => route.path,
  (currentPath) => {
    props.menuItems.forEach((item) => {
      if (item.children?.some((child) => currentPath === child.to || currentPath.startsWith(child.to + '/'))) {
        expandedItems.value[item.name] = true
      }
    })
  },
  { immediate: true },
)

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
