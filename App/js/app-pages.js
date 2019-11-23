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
    props: {},
    data() {
        return {
            tasks: []
        };
    },
    methods: {},
    mounted() {
        //Update local task array with FireBase data
        db.collection('tasks').onSnapshot(s => {
            //if first time
            if (this.tasks.length === 0) {
                //get tasks user is on
                let currentTasks = s.docs.filter(t => {
                    return t.usersOnTask != null &&
                        t.usersOnTask.some(u => {
                            return u.uid === this.authUser.uid
                        })
                });
                if (currentTasks) {
                    currentTasks.forEach(t => {
                        if (this.tasks.length < 8) {
                            this.tasks.push(new Task(t._document.proto))
                        }
                    })
                }
                if (this.tasks.length < 8) {
                    for (let i = 0; i < s.size; i++) {
                        if (this.tasks.length >= 8) break;

                        let newTask = s.docs[i]._document.proto;
                        //check: task of this category already
                        if (!this.tasks.some(t => {
                            return t.category === newTask.category
                        })) {
                            this.tasks.push(new Task(newTask));
                        }
                    }
                }
            } else {
                let changes = s.docChanges();
                changes.forEach(t => {
                    console.log('docChange: ', t);
                    if (t.type === 'modified') {
                        let toUpd = new Task(t.doc._document.proto);
                        let exist = this.tasks.find(t => {
                            return t.id === toUpd.id;
                        });
                        if (exist)
                            this.tasks.splice(this.tasks.indexOf(exist), 1, toUpd);
                    }
                });
            }
        });
        console.log("dungeon mounted");
    },
    // language=HTML
    template: `
        <v-row>
            <v-col v-for="(task, i) in tasks"
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