import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from '@/features/auth/authRoutes.ts'
import { demoRoutes } from '@/features/demo/demoRoutes.ts'
import { homeRoutes } from '@/features/home/homeRoutes.ts'
import { taskRoutes } from '@/features/tasks/taskRoutes.ts'
import { projectRoutes } from '@/features/projects/projectRoutes.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...authRoutes, ...demoRoutes, ...homeRoutes, ...taskRoutes, ...projectRoutes],
})

export default router
