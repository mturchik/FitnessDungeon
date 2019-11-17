const HomePage = Vue.component('HomePage', {
    props: {
        authUser: {required: true},
    },

    methods: {
        login() {
            bus.$emit('Login');
        }
    },

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
                                     class="secondary">Play Now!
                        </router-link>
                        <v-btn @click.prevent="login"
                               color="secondary"
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
    props: {
        authUser: {required: true},
        tasks: {required: true}
    },
    methods: {
        something(task) {
            console.log(task);
        }
    },
    computed:{
        isUserOnTask(task){
            return true//!task.usersOnTask.includes(this.authUser.uid);
        }
    },
    // language=HTML
    template: `
        <v-row>
            <v-col v-for="category in tasks"
                   :key="category.CategoryName"
                   cols="5">
                <v-card shaped color="primary">
                    <v-card-title>{{category.CategoryName}} - Bonus Points: {{category.BonusPoints}}</v-card-title>
                    <v-list dense color="primary">
                        <v-list-item two-line
                                     v-for="(task, i) in category.tasks"
                                     :key="i"
                                     link
                                     @click.prevent="something(task)">
                            <v-list-item-content>
                                <v-list-item-title>Task: {{task.task}}</v-list-item-title>
                                <v-list-item-subtitle>Points: {{task.points}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>
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