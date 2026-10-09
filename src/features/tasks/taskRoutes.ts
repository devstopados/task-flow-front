import type { RouteRecordRaw } from 'vue-router'

export const taskRoutes: RouteRecordRaw[] = [
  {
    path: '/tarefas',
    name: 'tasks',
    redirect: '/tarefas/backlog',
  },
  {
    path: '/tarefas/backlog',
    name: 'tasks-backlog',
    component: () => import('@/features/tasks/pages/TaskManagementPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/tarefas/sprint',
    name: 'tasks-sprint',
    component: () => import('@/features/tasks/pages/SprintPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
]

