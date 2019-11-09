let app = new Vue({
    el: '#app',
    vuetify: new Vuetify({
        theme: {
            themes: {
                light: {
                    primary: '#43b367',
                    secondary: '#ffa733',
                    background: '#346296'
                }
            }
        }
    }),
    data: {
        authUser: null
    },
    methods:
        {
            login() {
                let provider = new firebase.auth.GoogleAuthProvider();

                firebase.auth()
                    .signInWithPopup(provider)
                    .catch(function (error) {
                        // Handle Errors here.
                        let errorCode = error.code;
                        let errorMessage = error.message;

                        alert("Wow, there was a log in error here. Code: " + errorCode + " | Your personalized error message: " + errorMessage);
                    });
            },
            logout() {
                firebase.auth().signOut();
            },
        },
    computed: {
    },
    created: function () {
        firebase.auth().onAuthStateChanged((user) => {
            this.userLoaded = false;
            if (user) {
                // User is signed in.
                console.log('Signed in as: ', user.displayName);
                this.authUser = new User(user);
                //Create firebase user if needed
                db.collection('users')
                    .where("uid", "==", user.uid)
                    .limit(1)
                    .get()
                    .then((r) => {
                        //create user if needed
                        if (r.empty) {
                            db.collection('users')
                                .add(this.authUser)
                                .then((r) => {
                                    console.log("User added", r);
                                    this.authUser.firebaseId = r.id;
                                    this.authUser.mounts = JSON.stringify([]);
                                    return db.collection('users').doc(r.id).set(this.authUser);
                                })
                                .then((r) => {
                                    this.userLoaded = true;
                                    console.log("User updated", r);
                                })
                                .catch((e) => {
                                    console.error("Error on adding user", e);
                                });
                        } else {
                            db.collection('users')
                                .doc(r.docs[0].id)
                                .get()
                                .then((r) => {
                                    console.log("Already stored User get successful", r);
                                    this.authUser.firebaseId = r.id;
                                    this.authUser.mounts = JSON.parse(r.get("mounts"));
                                    this.userLoaded = true;
                                })
                                .catch((e) => {
                                    console.error("Error parsing firebase mounts", e)
                                });
                        }
                    })
                    .catch((e) => {
                        console.error("Error on the user get", e);
                    });
            } else {
                // User is signed out.
                console.log('Not signed in.');
                this.displayGallery = 0;
                this.authUser = null;
                this.userLoaded = true;
            }
        });
    },
    mounted() {    },
    watch: {}
});
