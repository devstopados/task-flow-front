import { createRouter, createWebHashHistory } from 'vue-router'
import { authRoutes } from '@/features/auth/authRoutes'
import { homeRoutes } from '@/features/home/homeRoutes'
import { taskRoutes } from '@/features/tasks/taskRoutes'
import { projectRoutes } from '@/features/projects/projectRoutes'
import { statusTaskRoutes } from '@/features/statusTasks/statusTaskRoutes'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRoutes,
    ...homeRoutes,
    ...taskRoutes,
    ...projectRoutes,
    ...statusTaskRoutes,
    {
      path: '/:pathMatch(.*)*',
      redirect: '/inicio',
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('taskflow_token')
  const isAuthenticated = Boolean(token)

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const guestOnly = to.matched.some((record) => record.meta.guestOnly)

  if (requiresAuth && !isAuthenticated) {
    next({
      name: 'login',
      query: to.fullPath !== '/' ? { redirect: to.fullPath } : undefined,
    })
    return
  }

  if (guestOnly && isAuthenticated) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router
