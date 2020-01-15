// import firebase from '../../../firebase'

export default {
    namespaced: true,
    state: {
        categories: [],
        movies: []
    },
    mutations: {
        setCategories(state, categories){
            state.categories = categories
        }
    },
    actions: {
        setCategories: ({commit}, categories) => {
            commit("setCategories", categories)
        }
    },
    getters: {
        categories: ({categories}) => categories
    },
    modules: {
        
    }
}