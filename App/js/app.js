let bus = new Vue({});
let app = new Vue({
    el: '#app',
    vuetify: new Vuetify({
        theme: {
            themes: {
                light: {
                    primary: '#00bfc6',
                    secondary: '#519cbe',
                    action: '#9516a5',
                    actionTwo: '#cd43d0',
                    gold: '#ffe424',
                    background: '#b6bbc0'
                }
            }
        }
    }),
    router: router,
    data: {
        authUser: null
    },
    created() {
        //User Authentication
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                console.log('Signed in as: ', user.displayName);
                this.authUser = new User(user);
                //get db user value
                db.collection('users').doc(user.uid).get().then(r => {
                    if (!r._document) {
                        db.collection('users').doc(user.uid).set(this.authUser);
                    }
                });
                this.$bind('authUser', db.collection('users').doc(user.uid));
                let message = this.authUser.displayName + ' has logged in.';
                bus.$emit('snackbar', message);
            } else {
                // User is signed out.
                console.log('Not signed in.');
                router.push('/');
                this.authUser = null;
            }
        });
    }
});
