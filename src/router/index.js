import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/',
      component: () => import('../components/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/import',
        },
        {
          path: 'import',
          name: 'import',
          component: () => import('../views/ImportView.vue'),
        },
        {
          path: 'records',
          name: 'records',
          component: () => import('../views/RecordsView.vue'),
        },
        {
          path: 'export',
          name: 'export',
          component: () => import('../views/ExportView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
})

router.beforeEach((to, _from, next) => {
  // useAuthStore() is safe to call here because by the time any navigation
  // fires, createPinia() has already been installed in main.js
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'import' })
  } else {
    next()
  }
})

export default router
