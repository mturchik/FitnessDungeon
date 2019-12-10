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
                route: '/Forum',
                buttonName: 'Forum'
            }

        ]
    }),
    methods: {
        changeRoute(path) {
            if (!path)
                path = '/dungeon';
            router.push(path, () => {
                bus.$emit('routeChange', path)
            });
        }
    },
// language=HTML
    template: `
        <v-container>
            <v-card class="mb-1">
                <v-container class="containerBackground">
                    <p class="text-center">Welcome to the Fitlivion Dungeon! Home to exotic challenges to train your
                        physique!</p>
                    <hr/>
                    <br/>
                    <v-row justify="center" class="pt-2">
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
            <v-row dense>
                <v-col v-for="(card, i) in cards"
                       :key="i"
                       cols="12">
                    <v-card color="#ffa686">
                        <div class="d-flex flex-no-wrap justify-space-between">
                            <div>
                                <v-card-title class="headline" v-text="card.title"
                                ></v-card-title>
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
        </v-container>
    `
});
const DungeonPage = Vue.component('DungeonPage', {
    mixins: [userMix],
    data() {
        return {
            tasks: [],
            displayedStrengthTasks:null,
            displayedCardioTasks:null,
            displayedFlexibilityTasks:null,
            showPicture: 'true'
        };
    },
    firestore: {
        tasks: db.collection('tasks')
    },
    methods: {
        randCardioTask() {
            let cardioTasks = this.tasks.filter(t => {
                return t.category === "Cardio"
            });
            return cardioTasks[Math.floor(Math.random() * cardioTasks.length)];
        },
        randStrengthTask() {
            let strengthTasks = this.tasks.filter(t => {
                return t.category === "Strength"
            });
            return strengthTasks[Math.floor(Math.random() * strengthTasks.length)];
        },
        randFlexTask() {
            let flexibilityTasks = this.tasks.filter(t => {
                return t.category === "Flexibility"
            });
            return flexibilityTasks[Math.floor(Math.random() * flexibilityTasks.length)];
        },
        addAllDisplayedTasks() {
            //TODO: Add logic to check if the user is currently on the task, and if they are, do not allow them to randomize it away?
            //TODO: Add a point cost to getting new tasks
            //TODO: After user completes a task, a new one should be presented
            this.showPicture = 'false';
            this.displayedStrengthTasks = (this.randStrengthTask());
            this.displayedCardioTasks = (this.randCardioTask());
            this.displayedFlexibilityTasks = (this.randFlexTask());

        }
    },
    mounted(){
        bus.$on('changeTask', (task)=>{
            switch(task.category){
                case 'Strength':
                    this.displayedStrengthTasks = (this.randStrengthTask());
                    break;
                case "Cardio":
                    this.displayedCardioTasks = (this.randCardioTask());
                    break;
                case "Flexibility":
                    this.displayedFlexibilityTasks = (this.randFlexTask());
                    break;
            }


        });
    },
    // language=HTML
    template: `
        <v-container v-if="tasks.length > 0">
            <v-row>
                <v-col v-if="displayedStrengthTasks"
                       cols="12"
                       sm="4"
                       lg="3"
                       width="400"
                        height="300">
                       
                    <task :auth-user="authUser" :task="displayedStrengthTasks"/>
                    
                </v-col>

                <v-col v-if="displayedCardioTasks"
                       cols="12"
                       sm="4"
                       lg="3"
                       width="400"
                       height="300">

                    <task :auth-user="authUser" :task="displayedCardioTasks"/>

                </v-col>

                <v-col v-if="displayedFlexibilityTasks"
                       cols="12"
                       sm="4"
                       lg="3"
                       width="400"
                       height="300">

                    <task :auth-user="authUser" :task="displayedFlexibilityTasks"/>

                </v-col>
            </v-row>
            <v-card :class="showPicture" v-if="showPicture=='true'">
               <v-img @click="addAllDisplayedTasks" src="img/frontsplash.png"></v-img>
            </v-card>
            
        </v-container>
    `
});
const LeaderBoardPage = Vue.component('LeaderBoardPage', {
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
    mixins: [userMix, badgeMix],
    mounted(){
        this.updateUser();
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
                        Points: {{authUser.points}}
                    </v-chip>
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
                <post :post="post" :auth-user="authUser"/>
            </v-col>
            <postMaker :auth-user="authUser"></postMaker>
        </v-row>
    `
});
const ShopPage = Vue.component('ShopPage', {
    mixins: [userMix, badgeMix],
    mounted(){
        this.updateUser();
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
