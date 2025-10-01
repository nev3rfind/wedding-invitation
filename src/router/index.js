import { createRouter, createWebHistory } from 'vue-router'
import InvitePage from '../views/InvitePage.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

const routes = [
  {
    path: '/invite/:inviteGuid',
    name: 'invite',
    component: InvitePage
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/admin'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
