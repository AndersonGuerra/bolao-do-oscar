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
    store.dispatch('auth/setUserData', user)
    let superUser = await db.collection("users").doc(user.uid).get();
    if (superUser.exists) {
      if (superUser.data().super != undefined) {
        store.dispatch("auth/setSuper")
      }
    }
    router.push({name: "Home"})
    db.collection("votes").doc(user.uid).onSnapshot((querySnapshot)=>{
      if (querySnapshot.data() != undefined){
        store.commit("movies/setUserVotes", querySnapshot.data())
      }
    })
    if (user.displayName != undefined){
      store.dispatch('auth/setUserName', user.displayName)
    }
  }else{
    store.commit("auth/removeUser")
    router.push({name: "Login"})
  }
});
