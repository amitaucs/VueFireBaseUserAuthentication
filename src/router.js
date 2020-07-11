import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store.js'

import WelcomePage from './components/welcome/welcome.vue'
import DashboardPage from './components/dashboard/dashboard.vue'
import SignupPage from './components/auth/signup.vue'
import SigninPage from './components/auth/signin.vue'
import UserDetailsPage from './components/user/userdetails.vue'

Vue.use(VueRouter)

const routes = [
    {path: '/', component: WelcomePage},
    {path: '/signup', component: SignupPage},
    {path: '/signin', component: SigninPage},
    {
        path: '/dashboard',
        component: DashboardPage,
        //Auth guard - not display dashboard if user is not authenticated
        beforeEnter(to, from, next) {
            if (store.state.idToken) {
                next()
            } else {
                next('/signin')
            }
        }
    },
    {
        path: '/userDetails',
        component: UserDetailsPage,
        //Auth guard - not display dashboard if user is not authenticated
        beforeEnter(to, from, next) {
            if (store.state.idToken) {
                next()
            } else {
                next('/signin')
            }
        }
    }
]

export default new VueRouter({mode: 'history', routes})
