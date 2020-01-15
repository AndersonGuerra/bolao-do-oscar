// import firebase from '../../../firebase'

export default {
    namespaced: true,
    state: {
        user: undefined,
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
        removeUser(state) {
            state.user = undefined
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
        }
    },
    getters: {
        hasUser: ({user}) => !!user,
        userData: ({user}) => user,
        loading: ({loading}) => loading
    },
    modules: {
        
    }
}