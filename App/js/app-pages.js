const HomePage = Vue.component('HomePage', {
    mixins: [userMix],

    props: {},

    methods: {},

    // language=HTML
    template: `
        <v-expansion-panels focusable
                            popout
                            mandatory>
            <v-expansion-panel>
                <v-expansion-panel-header>Welcome to the Dungeon</v-expansion-panel-header>
                <v-expansion-panel-content>
                    @sam can you write some stuff here, this is like the intro splash page
                    <hr/>
                    we should also format these to look nice too
                    <br/>
                    <v-row justify="center" class="pt-2">
                        <router-link v-if="authUser"
                                     to="/dungeon"
                                     tag="v-btn"
                                     class="action">Play Now!
                        </router-link>
                        <v-btn @click.prevent="login"
                               color="action"
                               class="ml-2"
                               v-else>Log In
                        </v-btn>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header>How to play</v-expansion-panel-header>
                <v-expansion-panel-content>
                    Lorem ipsum dolor sit amet.
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header>Compete with friends</v-expansion-panel-header>
                <v-expansion-panel-content>
                    Lorem ipsum dolor sit amet.
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header>Buy some bling</v-expansion-panel-header>
                <v-expansion-panel-content>
                    Lorem ipsum dolor sit amet.
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    `
});
const DungeonPage = Vue.component('DungeonPage', {
    mixins: [userMix],

    props: {
        tasks: {required: true}
    },
    methods: {},

    // language=HTML
    template: `
        <v-row>
            <v-col v-for="(category, i) in tasks"
                   :key="i"
                   cols="5">
                <category :auth-user="authUser" :category="category"/>
            </v-col>
        </v-row>
    `
});
const LeaderBoardPage = Vue.component('LeaderBoardPage', {
    props: {
        authUser: {required: true},
    },
    template: `<div>leaderboardPage</div>`
});
const ProfilePage = Vue.component('ProfilePage', {
    props: {
        authUser: {required: true},
    },
    template: `<div>profilePage</div>`
});
const ForumPage = Vue.component('ForumPage', {
    props: {
        authUser: {required: true},
    },
    template: `<div>forumPage</div>`
});
const ShopPage = Vue.component('ShopPage', {
    props: {
        authUser: {required: true},
    },
    template: `<div>shopPage</div>`
});


//======================================================================================================================

const router = new VueRouter({
    routes: [
        {path: '/', component: HomePage}, // default page
        {name: 'home', path: '/home', component: HomePage},
        {name: 'dungeon', path: '/dungeon', component: DungeonPage},
        {name: 'leaderBoard', path: '/leaderBoard', component: LeaderBoardPage},
        {name: 'profile', path: '/profile', component: ProfilePage},
        {name: 'forum', path: '/forum', component: ForumPage},
        {name: 'shop', path: '/shop', component: ShopPage},
    ],
});