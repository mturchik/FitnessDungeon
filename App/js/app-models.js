// Models //////////////////////////////////////////////////////////////
const User = function (firebaseUser) {
    let user = {
        displayName: '',
        uid: '',
        email: '',
        photoURL: ''
    };

    if (firebaseUser) {
        user.displayName = firebaseUser.displayName ? firebaseUser.displayName : '';
        user.uid = firebaseUser.uid ? firebaseUser.uid : '';
        user.email = firebaseUser.email ? firebaseUser.email : '';
        user.photoURL = firebaseUser.photoURL ? firebaseUser.photoURL : '';
    }

    return user;
};

////////////////////////////////////////////////////////////////////////
//Firebase Config
var firebaseConfig = {
    apiKey: "AIzaSyA6tBBf4Q4sJqg9EerEyRp-QPBAK_cs2kg",
    authDomain: "fitnessdungeon-d40e4.firebaseapp.com",
    databaseURL: "https://fitnessdungeon-d40e4.firebaseio.com",
    projectId: "fitnessdungeon-d40e4",
    storageBucket: "fitnessdungeon-d40e4.appspot.com",
    messagingSenderId: "737505878722",
    appId: "1:737505878722:web:244fa378a0ee32aefb115b",
    measurementId: "G-4F2NXL7C1X"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore through Firebase
const db = firebase.firestore();
// Init Vue Modules
Vue.use(Vuetify);
Vue.use(Vuefire);