let bus = new Vue({});
let app = new Vue({
    el: '#app',
    vuetify: new Vuetify({
        theme: {
            themes: {
                light: {
                    primary: '#765555',
                    secondary: '#ffa733',
                    background: '#271717'
                }
            }
        }
    }),
    router: router,
    data: {
        authUser: null,
        tasks: null
    },
    methods: {
        login() {
            let provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth()
                .signInWithPopup(provider)
                .catch(function (error) {
                    alert("Wow, there was a log-in error here. Code: " + error.code +
                        " | Your hand tailored error message: " + error.message);
                });
        },
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
            } else {
                // User is signed out.
                console.log('Not signed in.');
                this.authUser = null;
            }
        });
        //Update local task array with FireBase data
        db.collection('tasks').onSnapshot(s => {
            if (!this.tasks) {
                this.tasks = [];
                for (let i = 0; i < s.docs.length; i++) {
                    this.tasks.push(s.docs[i].data());
                }
            } else {
                for (let i = 0; i < s.docChanges().length; i++) {
                    let docChange = s.docChanges()[i];
                    if (docChange.type === "modified") {
                        let newCat = docChange.doc.data();
                        let oldCat = this.tasks.find((t) => {
                            return t.CategoryName === newCat.CategoryName
                        });
                        this.tasks.splice(this.tasks.indexOf(oldCat), 1, newCat);
                    } else
                        console.log("UNhandled change", docChange);
                }
            }
        });

    },
    mounted() {
        bus.$on('Login', () => {
            this.login();
        });
        bus.$on('Logout', () => {
            this.logout();
        });
    },
    watch: {}
});
