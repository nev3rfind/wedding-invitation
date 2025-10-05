import { createRouter, createWebHistory } from 'vue-router'

const InvitePage = () => import('../views/InvitePage.vue')
const AdminDashboard = () => import('../views/AdminDashboard.vue')
const NotFound = () => import('../views/NotFound.vue')

const routes = [
  {
    path: '/',
    redirect: '/invitation/76dbd7f2-9e6b-44eb-a20a-e799dc96f5bc'
  },
  {
    path: '/invitation/:code',
    name: 'invitation',
    component: InvitePage
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard,
    beforeEnter: (to, from, next) => {
      const password = prompt('Enter admin password:')
      if (password === 'test123') {
        next()
      } else {
        alert('Invalid password')
        next('/')
      }
    }
  },
  {
    path: '/404',
    name: 'not-found',
    component: NotFound
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
