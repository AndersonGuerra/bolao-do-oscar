import firebase from 'firebase/app'

let firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};
// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp