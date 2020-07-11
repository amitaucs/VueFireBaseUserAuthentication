import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store'

//define url globally
axios.defaults.baseURL = 'https://vueauthenticationdemo.firebaseio.com/'
//Check it in developer tool-> network-> user
//axios.defaults.headers.common['Authorization'] = 'some token'
axios.defaults.headers.get['Accepts'] = 'application/json'
//Interceptor
const requestInterceptor = axios.interceptors.request.use(config => {
  console.log('Request interceptor',config)
  //Intercepts a request and add more header
  //config.headers['Author'] = 'Amit'
  //must return config, else request will be blocked
  return config
})
const responseInterceptor = axios.interceptors.response.use(res=> {
  console.log('Response interceptor',res)
  return res
})

//To remove interceptor use eject . No log will be shown for above code.Comment eject to see log
axios.interceptors.request.eject(requestInterceptor)
axios.interceptors.response.eject(responseInterceptor)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
