import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import firebase from './firebase'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created(){
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        if (user.displayName != undefined){
          store.dispatch('auth/setUserName', user.displayName)
        }
        store.dispatch('auth/setUserData', user)
        router.push({name: "Home"})
      }else{
        store.commit("auth/removeUser")
        router.push({name: "Login"})
      }
    });
  },
}).$mount('#app')
