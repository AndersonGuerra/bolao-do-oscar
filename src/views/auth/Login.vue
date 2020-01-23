<template>
  <v-container>
    <v-content>
      <v-row>
        <v-col>
          <v-card>
            <v-container>
              <v-text-field filled v-model="form.email" label="email"></v-text-field>
              <v-text-field filled v-model="form.password" type="password" label="Senha"></v-text-field>
              <v-btn @click="login">
                <span v-if="!loading">Entrar</span>
                <div v-if="loading">
                  <v-progress-circular indeterminate></v-progress-circular><span class="pl-3">Entrando</span>
                </div>
              </v-btn>
            </v-container>
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-container>
              <v-text-field filled v-model="formNewUser.displayName" label="Nome"></v-text-field>
              <v-text-field filled v-model="formNewUser.email" label="email"></v-text-field>
              <v-text-field filled v-model="formNewUser.password" type="password" label="Senha"></v-text-field>
              <!-- <v-text-field filled v-model="formNewUser.confirmPassword" type="password" label="Confirmar senha"></v-text-field> -->
              <v-btn @click="createUser">
                <span v-if="!creatingAccout">Criar conta</span>
                <div v-if="creatingAccout">
                  <v-progress-circular indeterminate></v-progress-circular><span class="pl-3">Criando conta</span>
                </div>
              </v-btn>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar v-model="snackbarError" bottom :timeout="snackbarTimeout">
        {{ errorMessage }}
        <v-btn @click="snackbarError = false">Fechar</v-btn>
      </v-snackbar>

    </v-content>
  </v-container>
</template>
<script>
import firebase from '../../firebase'
import { mapGetters, mapActions } from 'vuex'

export default {
  data: () => ({
    snackbarError: false,
    snackbarTimeout: 6000,
    errorMessage: "",
    creatingAccout: false,
    form: {
      email: "a@a.com",
      password: "123@mudar",
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
    ...mapGetters("auth", ["userData", "loading"])
  },
  methods: {
    ...mapActions("auth", ["changeLoading"]),
    login() {
      this.changeLoading(true)
      firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password)
      .then(()=>{
        this.changeLoading(false)
      })
      .catch((error) => {
        this.changeLoading(false)
        this.errorMessage = error.message,
        this.snackbarError = true
      });
    },
    createUser(){
      this.creatingAccout = true
      firebase.auth().createUserWithEmailAndPassword(this.formNewUser.email, this.formNewUser.password)
        .then((result) => {
          this.creatingAccout = false
          // adiciona o displayName do usuário no estado do vuex
          this.$store.dispatch("auth/setUserName", this.formNewUser.displayName)
          // atualiza o usuário criado com o seu displayName
          return result.user.updateProfile({displayName: this.formNewUser.displayName})
        })
        .catch((error) =>{
          this.creatingAccout = false
          this.errorMessage = error.message,
          this.snackbarError = true
        });
    }
  }
};
</script>
