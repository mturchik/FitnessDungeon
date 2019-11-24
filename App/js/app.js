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
        //listener for start task
        bus.$on('startTask', (task) => {
            if (this.authUser) {
                if (!task.usersOnTask)
                    task.usersOnTask = [];
                //check if user on task
                if (!task.usersOnTask.some(u => {
                    return u.uid === this.authUser.uid
                })) {
                    let date = new Date();
                    //return a date that is 30 minutes in the future
                    if (date.getMinutes() < 50) {
                        //Add 30 minutes
                        date.setMinutes(date.getMinutes() + 10);
                    } else {
                        //subtract 30 and then add an hour to get the proper minutes past the hour
                        date.setMinutes(date.getMinutes() - 50);
                        date.setHours(date.getHours() + 1);
                    }

                    task.usersOnTask.push({uid: this.authUser.uid, canComplete: date});
                    db.collection('tasks').doc(task.id).set(task);
                }
            }
        });
        //listener for finish task
        bus.$on('finishTask', (task) => {
            if (this.authUser) {
                if (!task.usersOnTask)
                    task.usersOnTask = [];
                //check if user on task
                if (task.usersOnTask.some(u => {
                    return u.uid === this.authUser.uid
                })) {
                    let userOnTask = task.usersOnTask.find(u => {
                        return u.uid === this.authUser.uid
                    });
                    task.usersOnTask.splice(task.usersOnTask.indexOf(userOnTask), 1);
                    db.collection('tasks').doc(task.id).set(task);
                }
            }
        });
    },
    watch: {}
});