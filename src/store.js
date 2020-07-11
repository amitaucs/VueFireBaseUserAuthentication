import Vue from 'vue'
import Vuex from 'vuex'
import axios from "./axios-auth.js"
import globalAxios from 'axios'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        idToken: null,
        userId: null,
        user: null,
    },
    mutations: {
        //updates the state
        authUser(state,userData){
            state.idToken = userData.token
            state.userId = userData.userId
        },
        storeUser (state,user){
            state.user = user
        },
        clearAuthData(state){
            state.idToken = null
            state.userId = null
            state.user = null
        }
    },

    //used by templates to make javascript method call. Refer signup.vue
    actions: {
        setLogoutTimer({commit},expirationTime){
           setTimeout(() =>{
               commit('clearAuthData')
               router.replace('/signin')
           }, expirationTime * 1000)
        },

        signup({commit,dispatch}, authData) {
            axios.post('/accounts:signUp?key=key need to pass', {
                email: authData.email,
                password: authData.password,
                returnSecureToken: true
            })
                .then(res =>{ console.log(res)
                    //commit is linked with mutation
                   commit('authUser',{
                       token: res.data.idToken,
                       userId: res.data.localId
                   })
                    //Saving token in browser local storage
                    const now = new Date()
                    const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
                    localStorage.setItem('token',res.data.idToken)
                    localStorage.setItem('userId', res.data.localId)
                    localStorage.setItem('expirationDate', expirationDate)
                    //storing user data to firebase DB after login
                    dispatch('storeUser',authData)
                    dispatch('setLogoutTimer',res.data.expiresIn)
                    router.replace('/dashboard')
                })
                .catch(error => console.log(error))
        },

        login({commit, dispatch}, authData) {
            axios.post('/accounts:signInWithPassword?key=key need to pass', {
                email: authData.email,
                password: authData.password,
                returnSecureToken: true
            })
                .then(res =>{ console.log(res)
                    commit('authUser',{
                        token: res.data.idToken,
                        userId: res.data.localId

                    })

                    //Saving token in browser local storage
                    const now = new Date()
                    const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
                    localStorage.setItem('token',res.data.idToken)
                    localStorage.setItem('userId', res.data.localId)
                    localStorage.setItem('expirationDate', expirationDate)

                    dispatch('setLogoutTimer',res.data.expiresIn)
                    router.replace('/dashboard')
                })
                .catch(error => console.log(error))
        },
       //e.g if user refresh browser
        autoLogin({commit}) {
            const token = localStorage.getItem('token')
            if(!token){
                return
            }
            const expirationDate = localStorage.getItem('expirationDate')
            const now = new Date()
            if(now >= expirationDate){
                return
            }
            const userId = localStorage.getItem('userId')
            commit('authUser', {
                token: token,
                userId: userId
            })
            router.replace('/dashboard')
        },
        logout({commit}) {
            commit('clearAuthData')
            localStorage.removeItem('expirationDate')
            localStorage.removeItem('userId')
            localStorage.removeItem('token')
            router.replace('/signin')
        },

        storeUser({commit, state}, userData) {
            if(!state.idToken){
                return
            }
            globalAxios.post('/users.json'+ '?auth=' + state.idToken, userData)
                .then(res => console.log(res))
                .catch(error => console.log(error))
        },

        fetchUser({commit, state}) {
            if(!state.idToken){
                return
            }
            globalAxios.get('/users.json'+ '?auth=' + state.idToken)
                .then(res => {
                    console.log(res)
                    const data = res.data
                    const users = []
                    //this is the danger, we need to pick part of user data and not all user from firebase
                    for(let key in data){
                        const user  = data[key]
                        user.id= key
                        users.push(user)
                    }
                    console.log(users)
                    commit('storeUser',users[0])
                })
                .catch(error => console.log(error))
        },
    },
//Template use getter to get values. refer dashboard.vue
    getters: {
        user (state){
            return state.user
        },
        isAuthenticated(state){
           return state.idToken !==null
        }
    }
})
