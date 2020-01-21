<template>
  <v-container>
    <v-tabs v-model="tabMenu" fixed-tabs="">
      <v-tab v-if="this.super">Cadastros</v-tab>
      <v-tab v-if="this.super">Atualizações</v-tab>
      <v-tab>Seu Bolão</v-tab>
    </v-tabs>
    <div v-if="this.super && tabMenu == 0">
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>Cadastrar filme</v-card-title>
            <v-container>
                <v-text-field filled v-model="newMovie.url" label="URL do filme"></v-text-field>
                <v-text-field filled v-model="newMovie.oscarYear" label="Ano do Oscar"></v-text-field>
                <v-autocomplete filled v-model="newMovie.categories" label="Categorias" multiple="" 
                  :items="categories" item-text="name" :return-object="false"></v-autocomplete>
                <v-text-field filled v-if="hasBestActor" 
                  v-model="best.actor" label="Melhor ator"></v-text-field>
                <v-text-field filled v-if="hasBestActress" 
                  v-model="best.actress" label="Melhor atriz"></v-text-field>
                <v-text-field filled v-if="hasBestCoadActor" 
                  v-model="best.coadActor" label="Melhor ator coadjuvante"></v-text-field>
                <v-text-field filled v-if="hasBestCoadActress" 
                  v-model="best.coadActress" label="Melhor atriz coadjuvante"></v-text-field>
                <v-btn @click="searchMovie">Avançar</v-btn>
              </v-container>
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title>Cadastrar categoria</v-card-title>
            <v-container>
                <v-text-field filled v-model="category" label="Nome da categoria"></v-text-field>
                <v-btn @click="createCategory">Cadastrar categoria</v-btn>
              </v-container>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div v-if="this.super && tabMenu == 1"></div>
    <div v-if="(tabMenu == 0 && !this.super) || (tabMenu == 2 && this.super)">
      <v-list>
        <div class="mb-3 mr-2 ml-2" v-for="category in categories" :key="category.name">
          <v-row>
            <h3>{{category.name}}</h3>
          </v-row>
          <v-row>
            <div v-for="movie in movies" :key="movie.title">
              <v-card
                :color="votedMovies.filter((mov)=>mov.category == category.name 
                  && mov.title == movie.title).length>0
                   ? 'blue' : 'white'"
                @click="voteOnMovie(category.name, movie.title)"
                v-if="movie.categories.filter(cat=>(cat.name === category.name)).length > 0">
                <v-container>
                  <v-img :src="movie.poster" width="125"></v-img>
                </v-container>
              </v-card>
            </div>
          </v-row>
        </div>
      </v-list>
    </div>
    <v-dialog
      v-model="dialogCreateMovie"
      width="750"
    >
      <v-card
        class="mx-auto"
      >
        <v-container>
          <v-row>
            <v-col>
              <v-img
                class="white--text align-end"
                width="300"
                :src="movieData.poster"
              ></v-img>
            </v-col>
            <v-col>
              <v-card-title>{{movieData.title}}</v-card-title>

              <v-card-subtitle class="pb-0">{{movieData.overview}}</v-card-subtitle>

              <v-card-text class="text--primary">
                <div><a :href="'https://www.imdb.com/title/' + movieData.imdb">IMDB</a></div>
              </v-card-text>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn
            color="red"
            text
            @click="dialogCreateMovie = false"
          >
            Sair
          </v-btn>
          <v-btn
            color="blue"
            text
            @click="createMovie"
          >
            Cadastrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    tabMenu: 2,

    dialogCreateMovie: false,
    movieData: {},
    newMovie: {url: 'https://www.themoviedb.org/movie/475557-joker?language=pt-BR', oscarYear: 2020},
    category: '',
    best: {},
    hasBestActor: false,
    hasBestActress: false,
    hasBestCoadActor: false,
    hasBestCoadActress: false,

    votedMovies: []
  }),
  watch: {
    newMovie: {
      handler: function (newValue) {
        if (newValue.categories != undefined) {
          this.hasBestActor = newValue.categories.includes("Melhor ator")
          this.hasBestActress = newValue.categories.includes("Melhor atriz")
          this.hasBestCoadActor = newValue.categories.includes("Melhor ator coadjuvante")
          this.hasBestCoadActress = newValue.categories.includes("Melhor atriz coadjuvante")
        }
      },
      deep: true
    },
  },
  created() {
    if (this.votedMovies.length == 0) {
      if (this.$store.state["movies"]["userVotes"]['bolao'] != undefined) {
        this.votedMovies = this.$store.state["movies"]["userVotes"]['bolao']
      }
    }
  },
  methods: {
    async createCategory() {
      await firebase.firestore().collection('categories').doc().set({name: this.category});
      this.category = ''
    },
    async voteOnMovie(category, movie){
      if (this.votedMovies.filter((mov)=>mov.category == category && mov.title == movie) == 0) {
        let changingMovie = this.votedMovies.filter((mov)=>mov.category == category && mov.title != movie)
        if (changingMovie.length >= 1) {
          this.votedMovies.splice(this.votedMovies.indexOf(changingMovie[0]), 1, {category: category, title: movie})
        }else {
          this.votedMovies.push({category: category, title: movie})
        }
        let userId = this.$store.getters["auth/userData"].uid;
        let year = new Date().getFullYear()
        await firebase.firestore().collection('votes').doc(userId).set({
          year: year, bolao: this.votedMovies
        });
      }
    },
    cutUrl(url){
      return url.substring(33).split('-')[0];
    },
    searchMovie() {
      axios.get(`${this.cutUrl(this.newMovie.url)}${theMovieDbToken}`).then((result)=>{
        let movieData = {
          title: result.data.title,
          runtime: result.data.runtime,
          overview: result.data.overview,
          poster: `https://image.tmdb.org/t/p/w500${result.data.poster_path}`,
          imdb: result.data.imdb_id
        }
        this.movieData = movieData
        this.dialogCreateMovie = true;
      }).catch(er=>console.log(er))
    },
    async createMovie() {
      let categories = []
      this.newMovie.categories.forEach((category)=>{
        categories.push({name: category, isWinner: false})
      });
      if (this.hasBestActor) this.movieData.bestActor = this.best.actor
      if (this.hasBestActress) this.movieData.bestActor = this.best.actress
      if (this.hasBestCoadActor) this.movieData.bestActor = this.best.coadActor
      if (this.hasBestCoadActress) this.movieData.bestActor = this.best.coadActress
      this.movieData.categories = categories;
      await firebase.firestore().collection('movies').doc(this.movieData.title).set(this.movieData);
      this.movieData = {}
      this.newMovie.categories = []
      this.dialogCreateMovie = false;
      
    }
  },
  computed: {
    ...mapGetters("auth", ["super"]),
    ...mapGetters("movies", ["categories"]),
    ...mapGetters("movies", ["movies"]),
  }
}
</script>
