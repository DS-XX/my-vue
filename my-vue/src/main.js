// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
// import ElementUI from 'element-ui'
import './element'
import router from './router'
import base from './api/base.js'

Vue.config.productionTip = false
// axios.defaults.baseURL = 'http//127.0.0.1:8081'
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
Vue.prototype.$axios = axios
Vue.prototype.$api = base

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
