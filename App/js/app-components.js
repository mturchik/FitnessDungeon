Vue.component('navigation', {
    props: {
        authUser: {required: true},
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

    // language=HTML
    template: `
        <v-app-bar color="primary" app dense>
            <v-menu right bottom>
                <template v-slot:activator="{ on: menu }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-app-bar-nav-icon v-on="{ ...tooltip, ...menu }"></v-app-bar-nav-icon>
                        </template>
                        <span>Navigation</span>
                    </v-tooltip>
                </template>
                <v-list dense
                        rounded>
                    <router-link to="/home" tag="v-list-item">
                        <v-list-item-title>Home</v-list-item-title>
                    </router-link>
                    <router-link to="/dungeon" tag="v-list-item">
                        <v-list-item-title>Dungeon</v-list-item-title>
                    </router-link>
                    <router-link to="/leaderBoard" tag="v-list-item">
                        <v-list-item-title>Leaderboard</v-list-item-title>
                    </router-link>
                </v-list>
            </v-menu>
            <v-toolbar-title>Fit-Livion</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click.prevent="logout"
                   color="secondary"
                   class="ml-2"
                   v-if="authUser">Log Out
            </v-btn>
            <v-btn @click.prevent="login"
                   color="secondary"
                   class="ml-2"
                   v-else>Log In
            </v-btn>
            <v-avatar v-if="authUser">
                <v-img :src="authUser.photoURL"
                       class="d-none d-sm-flex"
                       alt="avatar"/>
            </v-avatar>
        </v-app-bar>
    `,

});