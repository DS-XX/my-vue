
import Vue from 'vue'
import VueRouter from 'vue-router'
import routerdata from './routerdata'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  routes: routerdata
})

export default router
