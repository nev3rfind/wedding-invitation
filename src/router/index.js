import { createRouter, createWebHistory } from 'vue-router'
import InvitePage from '../views/InvitePage.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import SetupPage from '../views/SetupPage.vue'

const routes = [
  {
    path: '/',
    name: 'setup',
    component: SetupPage
  },
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
    path: '/setup',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
