let bus = new Vue({});
let app = new Vue({
    el: '#app',
    vuetify: new Vuetify({
        theme: {
            themes: {
                light: {
                    primary: '#ffa686',
                    secondary: '#aa767c',
                    action: '#a3fe82',
                    actionTwo: '#24ff8e',
                    background: '#63474d'
                }
            }
        }
    }),
    router: router,
    data: {
        authUser: null
    },
    methods: {
        //user login
        login() {
            let provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth()
                .signInWithPopup(provider)
                .catch(function (error) {
                    alert("Wow, there was a log-in error here. Code: " + error.code +
                        " | Your hand tailored error message: " + error.message);
                });
        },
        //user logout
        logout() {
            firebase.auth().signOut();
        }
    },
    computed: {},
    created() {
        //User Authentication
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                console.log('Signed in as: ', user.displayName);
                this.authUser = new User(user);
                //get db user value
                db.collection('users').doc(user.uid).get().then(r => {
                    if (r._document) {
                        let dbUser = r._document.proto;
                        this.authUser = new User(user, dbUser);
                    } else {
                        db.collection('users').doc(user.uid).set(this.authUser);
                    }
                });
            } else {
                // User is signed out.
                console.log('Not signed in.');
                this.authUser = null;
            }
        });
    },
    mounted() {
        //listener for login
        bus.$on('Login', () => {
            this.login();
        });
        //listener for logout
        bus.$on('Logout', () => {
            this.logout();
        });
    },
    watch: {}
});