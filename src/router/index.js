import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/dashboard/Home.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/auth/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

let beforeEach = async (to, from, next) => {
  document.title = `${to.name} - Bolão do Oscar`
  if (to.name !== 'Login' && !store.getters['auth/hasUser']) {
    next({ name: 'Login' })
  } else {
    if (to.name === 'login' && store.getters['auth/hasUser']) {
      next({ name: 'Home' })
    } else {
      next()
    }   
  }
}

router.beforeEach(beforeEach)

export default router
