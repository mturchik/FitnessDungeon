const HomePage = Vue.component('HomePage', {
    mixins: [userMix],
    data: () => ({
        cards: [
            {
                title: 'How to Play',
                info: 'Complete Tasks and earn points, go to the dungeon!',
                src: 'img/howtoPlay.jpg',
                route: '/dungeon',
                buttonName:'Play!'
            },
            {
                title: 'Compete with Friends',
                info: 'Compare points on the leaderboard!',
                src: 'img/competewithFriends.jpg',
                route: '/leaderboard',
                buttonName:'Leaderboard'
            },
            {
                title: 'Buy some Bling',
                info: 'Buy your stuff to Bedazzle!',
                src: 'img/buysomeBling.jpg',
                route: '/shop',
                buttonName:'Shop'
            },
            {
                title: 'Forum',
                info: 'Give tips or express your like or dislike of tasks!',
                src: 'img/Forum.JPG',
                route: '/shop',
                buttonName:'Forum'
                }

        ]
    })
    ,
    props: {}
    ,
    methods: {},

// language=HTML
    template: `
        <v-container>
            <v-container>
                <v-card>
                    <v-container class="containerBackground">
                        <p class="text-center">Welcome to the Fitlivion Dungeon! Home to exotic challenges to train your
                            physique!</p>
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
            </v-container>
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
    props: {},
    data() {
        return {
            tasks: [],
            snackbar: false,
            timeout: 3000
        };
    },
    methods: {

        //three random tasks from tasks array loop thru array
        //make another array that pulls from tasks do math random at random index, check if already in array random by comparing
        //to ID of tasks,;
        //
    },
    created() {
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
    },
    mounted() {
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
    methods: {},
    created() {
        //populate from firebase
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
    created() {
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
    mounted() {
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
    props: {},
    data() {
        return {
            posts: [],
            filteredByPostId: ''
        };
    },
    methods: {},
    computed: {},
    created() {
        //populate from firebase
        db.collection('posts').onSnapshot(s => {
            //loop through all docs
            s.docs.forEach(p => {
                if (p._document.proto) {
                    let post = new Post(p._document.proto);
                    if (!this.posts.some(p => {
                        return p.id === post.id;
                    }))
                        this.posts.push(post);
                }
            });
            //check for altered posts in snapshot
            s.docChanges().forEach(b => {
                if (b.type === 'modified') {
                    let toUpd = new Post(b.doc._document.proto);
                    let exist = this.posts.find(p => {
                        return p.id === toUpd.id;
                    });
                    if (exist)
                        this.posts.splice(this.posts.indexOf(exist), 1, toUpd);
                }
            });
            //attempting to sort by liked!
            this.posts.sort((a, b) => {
                return b.likes - a.likes;
            });
        });
    },
    mounted() {
        //listener for a new post
        bus.$on('newPost', (post) => {
            post.id = db.collection('posts').doc().id;
            db.collection('posts').doc(post.id).set(post);
            console.log('posted post', post);
            bus.$emit('snackbar', 'You just made a new post!');
        });
        //listener for up votes on posts
        bus.$on('upVote', (post) => {
            post.likes += 1;
            db.collection('posts')
                .doc(post.id)
                .set(post);
            this.authUser.upVotes += 1;
            db.collection('users')
                .doc(post.posterUid)
                .update({upVotes: firebase.firestore.FieldValue.increment(1)});
        });
        //listener for down votes on posts
        bus.$on('downVote', (post) => {
            post.dislikes += 1;
            db.collection('posts')
                .doc(post.id)
                .set(post);
            this.authUser.downVotes += 1;
            db.collection('users')
                .doc(post.posterUid)
                .update({downVotes: firebase.firestore.FieldValue.increment(1)});
        });
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
    methods: {
        userHasBought(badge) {
            return badge.ownedByUsers.some(u => {
                return u.uid === this.authUser.uid;
            });
        }
    },
    computed: {},
    created() {
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
    },
    mounted() {
        //listener for buying a badge event
        bus.$on('buyBadge', (badge) => {
            if (!this.userHasBought(badge)) {
                badge.ownedByUsers.push({
                    uid: this.authUser.uid,
                    purchasedOn: new Date()
                });
                db.collection('badges').doc(badge.id).set(badge);
                this.authUser.points -= badge.cost;
                db.collection('users')
                    .doc(this.authUser.uid)
                    .update({points: firebase.firestore.FieldValue.increment(badge.cost * -1)});
                let message = this.authUser.displayName + ' now has [ ' + badge.title + ' ] !';
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
