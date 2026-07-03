import type { RouteRecordRaw } from 'vue-router'

export const taskRoutes: RouteRecordRaw[] = [
  {
    path: '/tarefas',
    name: 'tasks',
    component: () => import('@/features/tasks/pages/TaskManagementPage.vue'),
  },
]
