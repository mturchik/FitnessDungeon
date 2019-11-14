const HomePage = Vue.component('HomePage', {
    props: {
        authUser: {required: true},
    },

    // language=HTML
    template: `
        <v-col>
            <v-row>
                <v-btn class="primary">Hello</v-btn>
            </v-row>
        </v-col>
    `
});
const DungeonPage = Vue.component('DungeonPage', {
    props: {
        authUser: {required: true},
    },
    // language=HTML
    template: `
        <div>
            <v-img src="img/frontsplash.png" />
        </div>
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