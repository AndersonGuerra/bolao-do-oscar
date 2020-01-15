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
            <v-text-field filled v-model="form.displayName" label="Nome"></v-text-field>
            <v-text-field filled v-model="form.email" label="email"></v-text-field>
            <v-text-field filled v-model="form.password" type="password" label="Senha"></v-text-field>
            <v-text-field filled v-model="form.confirmPassword" type="password" label="Confirmar senha"></v-text-field>
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
      displayName: 'Alfredoaldo',
      email: "a@a.com",
      password: "123@mudar",
      confirmPassword: '',
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
      firebase.auth().createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then((result) => {
          // adiciona o displayName do usuário no estado do vuex
          this.$store.dispatch("auth/setUserName", this.form.displayName)
          // atualiza o usuário criado com o seu displayName
          return result.user.updateProfile({displayName: this.form.displayName})
        })
        .catch((error) =>{
          console.log(error.message)
        });
    }
  }
};
</script>
