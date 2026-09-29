<template>
  <div class="flex min-h-screen">
    <TaskSideBar :menu-items="menuItems" @logout="handleLogout" />

    <main class="flex-1 overflow-y-auto bg-white p-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import TaskSideBar from '@/components/TaskSideBar.vue'
import { useMenu } from '@/composables/useMenu'
import { useAuthStore } from '@/stores/auth'

defineOptions({
  name: 'LayoutInternalPage',
})

const router = useRouter()
const menuItems = useMenu()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>
