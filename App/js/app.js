let bus = new Vue({});
let app = new Vue({
    el: '#app',
    vuetify: new Vuetify({
        theme: {
            themes: {
                light: {
                    primary: '#ffa686',
                    secondary: '#aa767c',
                    tertiary: '#f26080',
                    action: '#a3fe82',
                    actionTwo: '#2ed3ff',
                    gold: '#ffe424',
                    background: '#63474d'
                }
            }
        }
    }),
    router: router,
    data: {
        authUser: null
    },
    methods: {},
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
                bus.$emit('routeChange', router.currentRoute.path);
                let message = this.authUser.displayName + ' has logged in.';
                bus.$emit('snackbar', message);
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
            let provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth()
                .signInWithPopup(provider)
                .catch(function (error) {
                    alert("Wow, there was a log-in error here. Code: " + error.code +
                        " | Your hand tailored error message: " + error.message);
                });
        });
        //listener for logout
        bus.$on('Logout', () => {
            let message = this.authUser.displayName + ' is logging out.';
            bus.$emit('snackbar', message);
            firebase.auth().signOut();
        });
    },
    watch: {}
});