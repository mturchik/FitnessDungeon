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
    },
    computed: {},
    created: function () {
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

        db.collection('tasks').onSnapshot(s => {
            console.log("TASK SNAPSHOT:", s);
            console.log("docs", s.docs);
            if (!this.tasks) {
                this.tasks = [];
                for (let i = 0; i < s.docs.length; i++) {
                    this.tasks.push(s.docs[i].data());
                }
            } else {
                console.log("docchanges", s.docChanges());
                for (let i = 0; i < s.docChanges().length; i++) {
                    let docChange = s.docChanges()[i];
                    switch (docChange.type) {
                        case "modified":
                            console.log("modified", docChange.doc.data());
                            //todo: FIND IN CURRENT TASKS AND UPDATE
                            break;
                        default:
                            console.log("UNhandled change", docChange);
                    }
                }
            }


        });
    },
    mounted() {},
    watch: {}
});
