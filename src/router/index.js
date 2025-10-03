import { createRouter, createWebHistory } from 'vue-router'
import WeddingInvitation from '../views/WeddingInvitation.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

const routes = [
  {
    path: '/',
    redirect: '/invitation/demo'
  },
  {
    path: '/invitation/:code',
    name: 'invitation',
    component: WeddingInvitation
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
