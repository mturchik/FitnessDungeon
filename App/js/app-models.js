// Models //////////////////////////////////////////////////////////////
const User = function (firebaseUser) {
    let user = {
        displayName: '',
        uid: '',
        email: '',
        photoURL: '',
        firebaseId: '',
        mounts: [0]//deserialize from string in firebase to an array
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
const firebaseConfig = {
    apiKey: "AIzaSyA6w5NxmSYIm1IKgXeUIVhRl0HekyZOT3w",
    authDomain: "wowprofit-66246.firebaseapp.com",
    databaseURL: "https://wowprofit-66246.firebaseio.com",
    projectId: "wowprofit-66246",
    storageBucket: "wowprofit-66246.appspot.com",
    messagingSenderId: "436347944709",
    appId: "1:436347944709:web:4abe41eed4778ed861416c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore through Firebase
const db = firebase.firestore();
// Init Vue Modules
Vue.use(Vuetify);
Vue.use(Vuefire);