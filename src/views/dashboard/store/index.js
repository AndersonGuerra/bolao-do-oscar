import firebase from '../../../firebase'
let db = firebase.firestore()

let store = {
    namespaced: true,
    state: {
        categories: [],
        movies: [],
        userVotes: {}
    },
    mutations: {
        setUserVotes(state, votes){
            state.userVotes = votes
        }
    },
    actions: {
        // setCategories: ({commit}, categories) => {
        //     commit("setCategories", categories)
        // }
    },
    getters: {
        categories: ({categories}) => categories,
        movies: ({movies}) => movies,

    },
    modules: {
        
    }
}

db.collection("categories").onSnapshot((querySnapshot)=>{
    store.state.categories = []
    querySnapshot.forEach((category)=>{
        store.state.categories.push(category.data())
    })
})

db.collection("movies").onSnapshot((querySnapshot)=>{
    store.state.movies = []
    querySnapshot.forEach((movie)=>{
        store.state.movies.push(movie.data())
    })
})

export default store