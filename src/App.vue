<template>
  <v-app>
    <div>
      <v-toolbar dense>
        <v-toolbar-title><h3>Bolão do Oscar</h3></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn elevation="0" v-if="this.hasUser" @click="this.logout">Sair</v-btn>
      </v-toolbar>
    </div>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import firebase from './firebase'
import { mapGetters } from 'vuex'

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
  methods: {
    logout(){
      firebase.auth().signOut().catch(function(error) {
          // An error happened.
          console.log(error)
      });
    }
  },
  computed: {
    ...mapGetters("auth", ["hasUser"])
  }
};
</script>
