// import firebase from '../../../firebase'

export default {
    namespaced: true,
    state: {
        user: undefined,
        superUser: false,
        loading: false,
    },
    mutations: {
        setUserName(state, payload) {
            if (state.user === undefined) {
                state.user = {
                    displayName: payload
                }
            } else {
                state.user.displayName = payload
            }
        },
        setUserData(state, payload) {
            if (state.user === undefined) {
                state.user = {
                    email: payload.email,
                    uid: payload.uid
                }
            } else {
                state.user.email = payload.email
                state.user.uid = payload.uid
            }
        },
        setSuper(state){
            state.superUser = true
        },
        removeUser(state) {
            state.user = undefined
            state.superUser = false
        },
        changeLoading(state) {
            state.loading = !state.loading
        }
    },
    actions: {
        setUserName: ({commit}, payload) => {
            commit('setUserName', payload);
        },
        setUserData: ({commit}, payload) => {
            commit('setUserData', payload);
        },
        setSuper: ({commit}) => {
            commit("setSuper")
        }
    },
    getters: {
        hasUser: ({user}) => !!user,
        userData: ({user}) => user,
        loading: ({loading}) => loading,
        super: ({superUser}) => superUser
    },
    modules: {
        
    }
}