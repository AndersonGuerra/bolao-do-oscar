import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import firebase from './firebase'

Vue.config.productionTip = false



let db = firebase.firestore()

firebase.auth().onAuthStateChanged(async (user) => {
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
  }).$mount('#app')
  if (user) {
    // User is signed in.
    db.collection("votes").doc(user.uid).onSnapshot((querySnapshot)=>{
      if (querySnapshot.data() != undefined){
        store.commit("movies/setUserVotes", querySnapshot.data())
      }
    })
    let superUser = await db.collection("users").doc(user.uid).get();
    if (superUser.exists) {
      if (superUser.data().super != undefined) {
        store.dispatch("auth/setSuper")
      }
    }
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
