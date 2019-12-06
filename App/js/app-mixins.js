const userMix = {
    props: {
        authUser: {required: true},
    },
    methods: {
        login() {
            firebase.auth()
                .signInWithPopup(new firebase.auth.GoogleAuthProvider())
                .catch(function (error) {
                    bus.$emit('snackbar', 'Error logging in! Check console for info!');
                    console.error(error);
                });
        },
        logout() {
            bus.$emit('snackbar', this.authUser.displayName + ' is logging out.');
            firebase.auth().signOut();
            router.push('/home', () => {
                bus.$emit('routeChange', '/home')
            });
        }
    }
};
const badgeMix = {
    data() {
        return {
            badges: [],
        };
    },
    firestore: {
        badges: db.collection('badges')
    },
    methods: {
        userHasBought(badge) {
            return badge.ownedByUsers.some(u => {
                return u.uid === this.authUser.uid;
            });
        }
    },
};