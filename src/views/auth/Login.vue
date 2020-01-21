<template>
  <v-content>
    <v-row>
      <v-col>
        <v-card>
          <v-container>
            <v-text-field filled v-model="form.email" label="email"></v-text-field>
            <v-text-field filled v-model="form.password" type="password" label="Senha"></v-text-field>
            <v-btn @click="login">Entrar</v-btn>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-container>
            <v-text-field filled v-model="formNewUser.displayName" label="Nome"></v-text-field>
            <v-text-field filled v-model="formNewUser.email" label="email"></v-text-field>
            <v-text-field filled v-model="formNewUser.password" type="password" label="Senha"></v-text-field>
            <v-text-field filled v-model="formNewUser.confirmPassword" type="password" label="Confirmar senha"></v-text-field>
            <v-btn @click="createUser">Criar conta</v-btn>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    {{userData}}
  </v-content>
</template>
<script>
import firebase from '../../firebase'
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    form: {
      email: "",
      password: "",
    },
    formNewUser: {
      displayName: '',
      email: "",
      password: "",
    },
    confirmPasswordRule: [
      value => !!value || 'Campo necessário.',
      value => value === this.form.password || 'As senhas devem coincidir.',
    ]
  }),
  computed: {
    ...mapGetters("auth", ["userData"])
  },
  methods: {
    login() {
      firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password)
      .catch((error) => {
          console.log(error)
      });
      // .then(()=>{
      //   console.log('erro')
      //   this.$router.push({ name: "Home" });
      // })
    },
    createUser(){
      firebase.auth().createUserWithEmailAndPassword(this.formNewUser.email, this.formNewUser.password)
        .then((result) => {
          // adiciona o displayName do usuário no estado do vuex
          this.$store.dispatch("auth/setUserName", this.formNewUser.displayName)
          // atualiza o usuário criado com o seu displayName
          return result.user.updateProfile({displayName: this.formNewUser.displayName})
        })
        .catch((error) =>{
          console.log(error.message)
        });
    }
  }
};
</script>
