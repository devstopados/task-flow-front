import type { RouteRecordRaw } from 'vue-router'

export const statusTaskRoutes: RouteRecordRaw[] = [
  {
    path: '/configuracoes/status-atividades',
    name: 'statusTasks',
    component: () => import('@/features/statusTasks/pages/StatusTaskManagementPage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
]
