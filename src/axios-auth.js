//How to write custom axios, we use it in signup.vue

import axios from 'axios'

const instance = axios.create({
    //refer https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
    baseURL: 'https://identitytoolkit.googleapis.com/v1'
})

//instance.defaults.headers.common['Description'] = 'This is local axios demo'

export default instance
