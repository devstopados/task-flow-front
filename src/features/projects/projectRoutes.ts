import type { RouteRecordRaw } from 'vue-router'

export const projectRoutes: RouteRecordRaw[] = [
  {
    path: '/projetos',
    name: 'projects',
    component: () => import('@/features/projects/pages/ProjectManagementPage.vue'),
  },
]
