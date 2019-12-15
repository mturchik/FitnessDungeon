const HomePage = Vue.component('HomePage', {
    mixins: [userMix],
    data: () => ({

        cards: [
            {
                title: 'How to Play',
                info: 'Complete Tasks and earn points, go to the dungeon!',
                src: 'img/howtoPlay.jpg',
                route: '/dungeon',
                buttonName: 'Into the Dungeon!'
            },
            {
                title: 'Compete with Friends',
                info: 'Compare points on the leaderboard!',
                src: 'img/competewithFriends.jpg',
                route: '/leaderBoard',
                buttonName: 'LeaderBoard'
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
                route: '/forum',
                buttonName: 'Forum'
            }
        ]
    }),
    methods: {
        changeRoute(path) {
            if (!path)
                path = '/dungeon';
            router.push(path);
        }
    },
// language=HTML
    template: `
        <v-row dense>
            <v-col cols="12">
                <v-card class="mb-1">
                    <v-container class="primary">
                        <h3 class="text-center mb-3">
                            Welcome to the Fitlivion Dungeon!
                            <br/>
                            Home to exotic challenges to train your physique!
                        </h3>
                        <hr/>
                        <v-row justify="center" class="pt-2 mt-1">
                            <v-btn v-if="authUser"
                                   @click.prevent="changeRoute()"
                                   class="action">Play Now!
                            </v-btn>
                            <v-btn @click.prevent="login"
                                   color="action"
                                   class="ml-2"
                                   v-else>Log In
                            </v-btn>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
            <v-col v-for="(card, i) in cards"
                   :key="i"
                   cols="12">
                <v-card color="secondary">
                    <div class="d-flex flex-no-wrap justify-space-between">
                        <div>
                            <v-card-title class="headline" v-text="card.title"></v-card-title>
                            <v-card-subtitle v-text="card.title"></v-card-subtitle>
                            <v-card-actions>
                                <v-btn v-if="authUser"
                                       @click="changeRoute(card.route)"
                                       class="action" text>{{card.buttonName}}
                                </v-btn>
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
    `
});
const DungeonPage = Vue.component('DungeonPage', {
    mixins: [userMix],
    data() {
        return {
            tasks: [],
            displayedStrengthTask: null,
            displayedCardioTask: null,
            displayedFlexibilityTask: null,
            showPicture: true,

        };
    },
    firestore: {
        tasks: db.collection('tasks')
    },
    methods: {
        getRandomTask(catFilter, ignoreOnTask) {
            //filter down category
            let fTasks = this.tasks.filter(t => {
                return t.category === catFilter
            });
            //get a task user is on
            let taskUserIsOn = fTasks.find(t => {
                return t.usersOnTask.some(t => {
                    return t.uid === this.authUser.uid
                })
            });
            if(ignoreOnTask && taskUserIsOn){
                fTasks.splice(fTasks.indexOf(taskUserIsOn), 1);
                taskUserIsOn = null;
            }

            return taskUserIsOn ? taskUserIsOn : fTasks[Math.floor(Math.random() * fTasks.length)];
        },
        addAllDisplayedTasks() {
            if (this.tasks.length > 0) {
                this.displayedStrengthTask = (this.getRandomTask("Strength"));
                this.displayedCardioTask = (this.getRandomTask("Cardio"));
                this.displayedFlexibilityTask = (this.getRandomTask("Flexibility"));
                this.showPicture = false;
            }
        }
    },
    mounted() {
        bus.$on('changeTask', (task) => {
            switch (task.category) {
                case 'Cardio':
                    this.displayedCardioTask = (this.getRandomTask("Cardio", true));
                    break;
                case 'Strength':
                    this.displayedStrengthTask = (this.getRandomTask("Strength", true));
                    break;
                case 'Flexibility':
                    this.displayedFlexibilityTask = (this.getRandomTask("Flexibility", true));
                    break;
            }
        });
    },
    // language=HTML
    template: `
        <v-row>
            <userBar :auth-user="authUser"></userBar>
            <v-col v-if="tasks.length > 0 && displayedStrengthTask"
                   cols="12"
                   lg="4">
                <task :auth-user="authUser" :task="displayedStrengthTask"/>
            </v-col>
            <v-col v-if="tasks.length > 0 && displayedCardioTask"
                   cols="12"
                   lg="4">
                <task :auth-user="authUser" :task="displayedCardioTask"/>
            </v-col>
            <v-col v-if="tasks.length > 0 && displayedFlexibilityTask"
                   cols="12"
                   lg="4">
                <task :auth-user="authUser" :task="displayedFlexibilityTask"/>
            </v-col>
            <v-card :class="showPicture" v-if="showPicture">
                <v-img @click="addAllDisplayedTasks"
                       src="img/frontsplash.png"
                       max-height="550"></v-img>
            </v-card>
        </v-row>
    `
});
const LeaderBoardPage = Vue.component('LeaderBoardPage', {
    mixins: [userMix],
    data() {
        return {
            headers: [
                {text: 'Username', value: 'displayName'},
                {text: 'Current Points', value: 'points'},
                {text: 'Cardio', value: 'cardioPoints'},
                {text: 'Strength', value: 'flexPoints'},
                {text: 'Flexibility', value: 'strengthPoints'},
                {text: 'Badges', value: 'badgeCount'},
                {text: 'Up-Votes', value: 'upVotes'},
                {text: 'Down-Votes', value: 'downVotes'}
            ],
            users: [],

        };
    },
    firestore: {
        users: db.collection('users')
    },
    // language=HTML
    template: `
        <v-row>
            <userBar v-if="authUser" :auth-user="authUser"></userBar>
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
    mixins: [userMix, badgeMix],
    data() {
        return {
            displayProfilePicture: 'img/baseGuy.png'

        };
    },
    mounted(){
        bus.$on('changeDisplayBadge', (display) => {
            switch (display) {
                case "Sewage":
                    this.displayProfilePicture = 'img/SewageGuy.png';
                    break;
                case "Rocker":
                    this.displayProfilePicture = 'img/RockerGuy.png';
                    break;
                case "TP":
                    this.displayProfilePicture = 'img/TPGuy.png';
                    break;
                case "Buff":
                    this.displayProfilePicture = 'img/BuffGuy.png';
                    break;
                case "Best":
                    this.displayProfilePicture = 'img/BestGuy.png';
                    break;
                case "Hoard":
                    this.displayProfilePicture = 'img/HoardGuy.png';
                    break;

            }
        });
    },
    // language=HTML
    template: `        
        <v-row>
            <userBar :auth-user="authUser"></userBar>
            <v-col cols="12"
                   sm="4"
                   lg="3">
                <v-card>
                    <v-img :src="displayProfilePicture"></v-img>
                </v-card>
            </v-col>
            
            <v-col v-for="(badge, i) in badges"
                   v-if="userHasBought(badge)"
                   :key="i"
                   cols="12"
                   sm="4"
                   lg="3">
                <profileBadge :badge="badge" :auth-user="authUser" />
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
        posts: db.collection('posts').orderBy("datePosted", "desc")
    },
    // language=HTML
    template: `
        <v-row>
            <userBar :auth-user="authUser"></userBar>
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
                <post :post="post" :auth-user="authUser"/>
            </v-col>
            <postMaker :auth-user="authUser"></postMaker>
        </v-row>
    `
});
const ShopPage = Vue.component('ShopPage', {
    mixins: [userMix, badgeMix],
    // language=HTML
    template: `
        <v-row>
            <userBar :auth-user="authUser"></userBar>
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
