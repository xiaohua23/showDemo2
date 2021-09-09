import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Emotion from '../views/Emotion'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/emotion',
    name: 'Emotion',
    component: Emotion,
  }
]

const router = new VueRouter({
  routes,
})

export default router
