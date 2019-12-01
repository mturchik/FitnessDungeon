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
            tasks: [],
            snackbar: false,
            timeout: 3000
        };
    },
    methods: {},
    mounted() {
        //Update local task array with FireBase data
        db.collection('tasks').onSnapshot(s => {
            //if first time
            if (this.tasks.length === 0) {
                s.docs.forEach(t => {
                    let task = new Task(t._document.proto);
                    if (task.usersOnTask.some(u => {
                            return u.uid === this.authUser.uid
                        }) ||
                        this.tasks.length < 25
                    )
                        this.tasks.push(task);
                });
            } else {
                s.docChanges().forEach(t => {
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
        //listener for start task
        bus.$on('startTask', (task) => {
            if (this.authUser) {
                if (!task.usersOnTask)
                    task.usersOnTask = [];
                //check if user on task
                if (!task.usersOnTask.some(u => {
                    return u.uid === this.authUser.uid
                })) {
                    let date = new Date();
                    //return a date that is 30 minutes in the future
                    // if (date.getMinutes() < 50) {
                    //     //Add 30 minutes
                    //     date.setMinutes(date.getMinutes() + 10);
                    // } else {
                    //     //subtract 30 and then add an hour to get the proper minutes past the hour
                    //     date.setMinutes(date.getMinutes() - 50);
                    //     date.setHours(date.getHours() + 1);
                    // }

                    task.usersOnTask.push({uid: this.authUser.uid, canComplete: date});
                    db.collection('tasks').doc(task.id).set(task);
                    let message = 'Task started: ' + task.details;
                    bus.$emit('snackbar', message);
                }
            }
        });
        //listener for finish task
        bus.$on('finishTask', (task) => {
            if (this.authUser) {
                if (!task.usersOnTask)
                    task.usersOnTask = [];
                //check if user on task
                if (task.usersOnTask.some(u => {
                    return u.uid === this.authUser.uid
                })) {
                    let userOnTask = task.usersOnTask.find(u => {
                        return u.uid === this.authUser.uid
                    });
                    //remove user from 'on task' status
                    task.usersOnTask.splice(task.usersOnTask.indexOf(userOnTask), 1);
                    db.collection('tasks').doc(task.id).set(task);
                    //change local user.points value then update db version
                    this.authUser.points += task.points;
                    switch (task.category) {
                        case 'Cardio':
                            this.authUser.cardioPoints += task.points;
                            break;
                        case 'Strength':
                            this.authUser.strengthPoints += task.points;
                            break;
                        case 'Flexibility':
                            this.authUser.flexPoints += task.points;
                            break;
                    }

                    db.collection('users').doc(this.authUser.uid).set(this.authUser);
                    let message = 'You have ' + this.authUser.points + ' points!';
                    bus.$emit('snackbar', message);
                }
            }
        });
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
    props: {},
    data() {
        return {
            headers: [
                {text: 'Current Points', value: 'points'},
                {text: 'Username', value: 'displayName'},
                {text: 'Cardio', value: 'cardioPoints'},
                {text: 'Strength', value: 'flexPoints'},
                {text: 'Flexibility', value: 'strengthPoints'}
            ],
            users: []
        };
    },
    methods: {},
    mounted() {
        db.collection('users').onSnapshot(s => {
            if (this.users.length === 0) {
                s.docs.forEach(u => {
                    let user = new User(null, u._document.proto);
                    this.users.push(user);
                });
            } else {
                s.docChanges().forEach(u => {
                    if (u.type === 'modified') {
                        let toUpd = new User(null, u.doc._document.proto);
                        let exist = this.users.find(u => {
                            return u.uid === toUpd.uid;
                        });
                        if (exist)
                            this.users.splice(this.users.indexOf(exist), 1, toUpd);
                    }
                });
            }
        });
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
                              :sort-desc="[true]"<!--REMOVE IF THIS IS ACTUALLY INVERTED, IDK WE ONLY HAVE ONE USER!-->
                              dense
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
            badges: [],
        };
    },
    methods: {
        userHasBought(badge) {
            return badge.ownedByUsers.some(u => {
                return u.uid === this.authUser.uid;
            });
        }
    },
    computed: {},
    mounted() {
        //populate from firebase
        db.collection('badges').onSnapshot(s => {
            if (this.badges.length === 0) {
                s.docs.forEach(b => {
                    let badge = new Badge(b._document.proto);
                    if (this.userHasBought(badge))
                        this.badges.push(badge);
                });
            } else {
                s.docChanges().forEach(b => {
                    if (b.type === 'modified') {
                        let toUpd = new Badge(b.doc._document.proto);
                        if (this.userHasBought(toUpd)) {
                            let exist = this.badges.find(b => {
                                return b.id === toUpd.id;
                            });
                            if (exist)
                                this.badges.splice(this.badges.indexOf(exist), 1, toUpd);
                            else
                                this.badges.push(toUpd);
                        }
                    }
                });
            }
        });
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
    props: {
        authUser: {required: true},
    },
    template: `<div>forumPage</div>`
});
const ShopPage = Vue.component('ShopPage', {
    mixins: [userMix],
    props: {},
    data() {
        return {
            badges: [],
            snackbar: false,
            timeout: 3000
        };
    },
    methods: {
        userHasBought(badge) {
            return badge.ownedByUsers.some(u => {
                return u.uid === this.authUser.uid;
            });
        }
    },
    computed: {},
    mounted() {
        //populate from firebase
        db.collection('badges').onSnapshot(s => {
            if (this.badges.length === 0) {
                s.docs.forEach(b => {
                    let badge = new Badge(b._document.proto);
                    this.badges.push(badge);
                });
            } else {
                s.docChanges().forEach(b => {
                    if (b.type === 'modified') {
                        let toUpd = new Badge(b.doc._document.proto);
                        let exist = this.badges.find(b => {
                            return b.id === toUpd.id;
                        });
                        if (exist)
                            this.badges.splice(this.badges.indexOf(exist), 1, toUpd);
                    }
                });
            }
        });
        //listener for buying a badge event
        bus.$on('buyBadge', (badge) => {
            if (!this.userHasBought(badge)) {
                badge.ownedByUsers.push({
                    uid: this.authUser.uid,
                    purchasedOn: new Date()
                });
                db.collection('badges').doc(badge.id).set(badge);
                this.authUser.points -= badge.cost;
                db.collection('users').doc(this.authUser.uid).set(this.authUser);
                let message = this.authUser.displayName + ' has a new badge!';
                bus.$emit('snackbar', message);
            }
        });
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
            <v-snackbar v-if="authUser"
                        v-model="snackbar"
                        :timeout="timeout">
                <h1>You have {{authUser.points}} points remaining</h1>
                <v-btn color="action"
                       text
                       @click="snackbar = false">Close
                </v-btn>
            </v-snackbar>
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