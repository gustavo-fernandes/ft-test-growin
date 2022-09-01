import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView'
import CharacterView from '../views/CharacterView'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    name: 'character',
    path: '/character/:id',
    component: CharacterView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
