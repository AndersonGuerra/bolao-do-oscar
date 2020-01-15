<template>
  <v-container>
    <div v-if="this.super">
      <v-row>
        <v-col>
          <v-card>
            <v-container>
                <v-text-field filled v-model="newMovie.url" label="URL do filme"></v-text-field>
                <v-text-field filled v-model="newMovie.oscarYear" label="Ano do Oscar"></v-text-field>
                <v-combobox filled v-model="newMovie.categories" label="Categorias" multiple="" 
                  :items="categories" item-text="name"></v-combobox>
                <v-btn @click="createMovie">Cadastrar filme</v-btn>
              </v-container>
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-container>
                <v-text-field filled v-model="category" label="Nome da categoria"></v-text-field>
                <v-btn @click="createCategory">Cadastrar categoria</v-btn>
              </v-container>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from '../../axios';
import firebase from '../../firebase';
import theMovieDbToken from '../../config/theMovieDBtoken';

export default {
  name: 'home',
  components: {
  },
  data: () => ({
    newMovie: {url: 'https://www.themoviedb.org/movie/419704-ad-astra'},
    category: ''
  }),
  methods: {
    async createCategory() {
      await firebase.firestore().collection('categories').doc().set({name: this.category});
      this.category = ''
    },
    cutUrl(url){
      return url.substring(33).split('-')[0];
    },
    createMovie() {
      axios.get(`${this.cutUrl(this.newMovie.url)}${theMovieDbToken}`).then((result)=>{
        console.log(result.data.overview)
      })
    }
  },
  computed: {
    ...mapGetters("auth", ["super"]),
    ...mapGetters("movies", ["categories"]),
  }
}
</script>
