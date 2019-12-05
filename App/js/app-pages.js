const HomePage = Vue.component('HomePage', {
    mixins: [userMix],
    data: () => ({
        cards: [
            {
                title: 'How to Play',
                info: 'Complete Tasks and earn points, go to the dungeon!',
                src: 'img/howtoPlay.jpg',
                route: '/dungeon',
                buttonName: 'Play!'
            },
            {
                title: 'Compete with Friends',
                info: 'Compare points on the leaderboard!',
                src: 'img/competewithFriends.jpg',
                route: '/leaderboard',
                buttonName: 'Leaderboard'
            },
            {
                title: 'Buy some Bling',
                info: 'Buy your stuff to Bedazzle!',
                src: 'img/buysomeBling.jpg',
                route: '/shop',
                buttonName: 'Shop'
            },
            {
                title: 'Forum',
                info: 'Give tips or express your like or dislike of tasks!',
                src: 'img/Forum.JPG',
                route: '/shop',
                buttonName: 'Forum'
            }
        ]
    }),
// language=HTML
    template: `
        <v-container>
            <v-card color="primary">
                <h3 class="text-center">Welcome to the Fitlivion Dungeon! Home to exotic challenges to train your
                    physique!</h3>
                <hr/>
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
            </v-card>
            <v-row dense>
                <v-col v-for="(card, i) in cards"
                       :key="i"
                       cols="12">
                    <v-card color="primary">
                        <div class="d-flex flex-no-wrap justify-space-between">
                            <div>
                                <v-card-title class="headline" v-text="card.title"
                                ></v-card-title>
                                <v-card-subtitle v-text="card.title"></v-card-subtitle>
                                <v-card-actions>
                                    <router-link v-if="authUser"
                                                 :to="card.route"
                                                 tag="v-btn"
                                                 class="action" text>{{card.buttonName}}
                                    </router-link>
                                    <v-btn @click.prevent="login"
                                           color="action"
                                           class="ml-2"
                                           v-else>Log In
                                    </v-btn>
                                </v-card-actions>
                            </div>
                            <v-avatar class="ma-3" size="125" tile>
                                <v-img :src="card.src"></v-img>
                            </v-avatar>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    `
});
const DungeonPage = Vue.component('DungeonPage', {
    mixins: [userMix],
    data() {
        return {
            tasks: [],
            displayedTasks: [],
            snackbar: false,
            timeout: 3000
        };
    },
    firestore: {
        tasks: db.collection('tasks')
    },
    methods: {
        //three random tasks from tasks array loop thru array
        //make another array that pulls from tasks do math random at random index, check if already in array random by comparing
        //to ID of tasks,;
        randomizeDisplayedTasks(){
            this.displayedTasks = this.tasks;
            return this.displayedTasks;
        }
    },
    mounted() {
        this.randomizeDisplayedTasks();
    },
    // language=HTML
    template: `
        <v-row>
            <v-col v-for="(task, i) in displayedTasks"
                   :key="i"
                   cols="12"
                   sm="4"
                   lg="3">
                <task :auth-user="authUser" :task="task"/>
            </v-col>
        </v-row>
    `
});
const LeaderBoardPage = Vue.component('LeaderBoardPage', {
    props: {},
    data() {
        return {
            headers: [
                {text: 'Username', value: 'displayName'},
                {text: 'Current Points', value: 'points'},
                {text: 'Cardio', value: 'cardioPoints'},
                {text: 'Strength', value: 'flexPoints'},
                {text: 'Flexibility', value: 'strengthPoints'},
                {text: 'Up-Votes', value: 'upVotes'},
                {text: 'Down-Votes', value: 'downVotes'}
            ],
            users: []
        };
    },
    firestore: {
        users: db.collection('users')
    },
    // language=HTML
    template: `
        <v-row>
            <v-col>
                <v-data-table :headers="headers"
                              :items="users"
                              :items-per-page="10"
                              must-sort
                              :sort-by="['points']"
                              :sort-desc="[true]"
                              class="elevation-1 primary">
                </v-data-table>
            </v-col>
        </v-row>
    `
});
const ProfilePage = Vue.component('ProfilePage', {
    mixins: [userMix],
    props: {},
    data() {
        return {
            badges: []
        };
    },
    firestore:{
        badges: db.collection('badges')
    },
    methods: {
        userHasBought(badge) {
            return badge.ownedByUsers.some(u => {
                return u.uid === this.authUser.uid;
            });
        }
    },
    // language=HTML
    template: `
        <v-row>
            <v-col cols="12" justify-self="center">
                <v-toolbar color="primary"
                           v-if="authUser"
                           floating>
                    <v-toolbar-title>{{authUser.displayName}}'s Profile</v-toolbar-title>
                    <v-chip color="gold"
                            class="ml-4">
                        Badges: {{badges.length}}
                    </v-chip>
                    <v-chip color="gold"
                            class="ml-4">
                        Up-Votes: {{authUser.upVotes}}
                    </v-chip>
                    <v-chip color="gold"
                            class="ml-4">
                        Down-Votes: {{authUser.downVotes}}
                    </v-chip>
                </v-toolbar>
            </v-col>
            <v-col v-for="(badge, i) in badges"
                   v-if="userHasBought(badge)"
                   :key="i"
                   cols="12"
                   sm="4"
                   lg="3">
                <profileBadge :badge="badge" :auth-user="authUser"/>
            </v-col>
        </v-row>
    `
});
const ForumPage = Vue.component('ForumPage', {
    mixins: [userMix],
    data() {
        return {
            posts: []
        };
    },
    firestore: {
        posts: db.collection('posts')
    },
    // language=HTML
    template: `
        <v-row v-if="authUser">
            <v-col cols="12" justify-self="center">
                <v-toolbar color="primary"
                           v-if="authUser">
                    <v-toolbar-title>Fitness Forum</v-toolbar-title>
                </v-toolbar>
            </v-col>
            <v-col cols="12"
                   v-for="(post, i) in posts"
                   :key="i"
                   justify-self="center">
                <post :post="post"/>
            </v-col>
            <postMaker :auth-user="authUser"></postMaker>
        </v-row>
    `
});
const ShopPage = Vue.component('ShopPage', {
    mixins: [userMix],
    props: {},
    data() {
        return {
            badges: []
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
    // language=HTML
    template: `
        <v-row>
            <v-col cols="12" justify-self="center">
                <v-toolbar color="primary"
                           v-if="authUser"
                           floating>
                    <v-toolbar-title>{{authUser.displayName}}'s Wallet Contains</v-toolbar-title>
                    <v-chip color="gold"
                            class="ml-4">
                        Points: {{authUser.points}}
                    </v-chip>
                </v-toolbar>
            </v-col>
            <v-col v-for="(badge, i) in badges"
                   v-if="!userHasBought(badge)"
                   :key="i"
                   cols="12"
                   sm="4"
                   lg="3">
                <storeBadge :badge="badge" :auth-user="authUser"/>
            </v-col>
        </v-row>
    `
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
