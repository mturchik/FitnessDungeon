//Misc Components
Vue.component('navigation', {
    mixins: [userMix],
    data() {
        return {
            bottomNav: this.navFromRoute(router.currentRoute.path)
        }
    },
    methods: {
        navFromRoute(route) {
            switch (route) {
                case '/':
                case '/home':
                    return 1;
                case '/dungeon':
                    return 2;
                case '/profile':
                    return 3;
                case '/forum':
                    return 4;
                case '/shop':
                    return 5;
                case '/leaderBoard':
                    return 6;
            }
        }
    },
    created() {
        router.afterEach(r => {
            this.bottomNav = this.navFromRoute(r.path);
        });
    },
    // language=HTML
    template: `
        <v-bottom-navigation background-color="primary"
                             :value="bottomNav"
                             app
                             mandatory>
            <router-link to="/home" tag="v-btn" v-show="!authUser">
                <span>Home</span>
                <v-icon>mdi-home</v-icon>
            </router-link>
            <router-link to="/dungeon" tag="v-btn" v-if="authUser">
                <span>Dungeon</span>
                <v-icon>mdi-castle</v-icon>
            </router-link>
            <router-link to="/profile" tag="v-btn" v-if="authUser">
                <span>Profile</span>
                <v-icon>mdi-face-profile</v-icon>
            </router-link>
            <router-link to="/forum" tag="v-btn" v-if="authUser">
                <span>Forum</span>
                <v-icon>mdi-forum</v-icon>
            </router-link>
            <router-link to="/shop" tag="v-btn" v-if="authUser">
                <span>Shop</span>
                <v-icon>mdi-basket</v-icon>
            </router-link>
            <router-link to="/leaderBoard" tag="v-btn" v-if="authUser">
                <span>LeaderBoard</span>
                <v-icon>mdi-bulletin-board</v-icon>
            </router-link>

            <v-btn v-if="authUser" @click="logout">
                <span>Log Out</span>
                <v-icon>mdi-account-off-outline</v-icon>
            </v-btn>
            <v-btn v-else @click="login">
                <span>Log In</span>
                <v-icon>mdi-account-plus</v-icon>
            </v-btn>
        </v-bottom-navigation>
    `,
});
Vue.component('snack', {
    data() {
        return {
            snackbar: false,
            timeout: 5000,
            message: ''
        }
    },
    methods: {
        reset() {
            this.message = '';
            this.snackbar = false;
        }
    },
    watch: {
        snackbar: function (newVal) {
            if (!newVal) {
                this.reset();
            }
        }
    },
    created() {
        bus.$on('snackbar', (message) => {
            this.reset();
            this.message = message;
            this.snackbar = true;
        });
    },

    // language=HTML
    template: `
        <v-snackbar bottom
                    class="mb-12"
                    color="secondary"
                    v-model="snackbar"
                    :timeout="timeout">
            <h3>{{message}}</h3>
            <v-btn color="action"
                   text
                   @click="snackbar = false">Close
            </v-btn>
        </v-snackbar>
    `
});
Vue.component('userBar', {
    props: {
        authUser: {required: true}
    },
    // language=HTML
    template: `
        <v-col cols="12" justify-self="center">
            <v-toolbar color="primary"
                       v-if="authUser"
                       floating>
                <v-toolbar-title>{{authUser.displayName}} -</v-toolbar-title>
                <v-chip color="gold"
                        class="ml-4">
                    Points: {{authUser.points}}
                </v-chip>
                <v-chip color="gold"
                        class="ml-4">
                    Badges: {{authUser.badgeCount}}
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
    `
});
//Task Components
Vue.component('task', {
    mixins: [userMix],
    props: {
        task: {required: true}
    },
    methods: {
        startTask() {
            if (this.authUser &&
                !this.userIsOnTask) {
                let date = new Date();
                //return a date that is 30 minutes in the future
                if (date.getMinutes() < (60 - this.task.timeout)) {
                    //Add minutes
                    date.setMinutes(date.getMinutes() + this.task.timeout);
                } else {
                    //subtract and then add an hour to get the proper minutes past the hour
                    date.setMinutes(date.getMinutes() - (60 - this.task.timeout));
                    date.setHours(date.getHours() + 1);
                }

                this.task.usersOnTask.push({uid: this.authUser.uid, canComplete: date});
                db.collection('tasks').doc(this.task.id).update({usersOnTask: this.task.usersOnTask});

                bus.$emit('snackbar', 'Task started: ' + this.task.details);
            }
        },
        finishTask() {
            if (this.authUser &&
                this.userIsOnTask) {
                let userOnTask = this.task.usersOnTask.find(u => {
                    return u.uid === this.authUser.uid
                });
                //remove user from 'on task' status
                this.task.usersOnTask.splice(this.task.usersOnTask.indexOf(userOnTask), 1);
                db.collection('tasks').doc(this.task.id)
                    .update({usersOnTask: this.task.usersOnTask})
                    .then(() => {
                        bus.$emit('changeTask', this.task);
                    });
                //change local user.points value then update db version
                switch (this.task.category) {
                    case 'Cardio':
                        db.collection('users').doc(this.authUser.uid)
                            .update({
                                points: firebase.firestore.FieldValue.increment(this.task.points),
                                cardioPoints: firebase.firestore.FieldValue.increment(this.task.points)
                            });
                        break;
                    case 'Strength':
                        db.collection('users').doc(this.authUser.uid)
                            .update({
                                points: firebase.firestore.FieldValue.increment(this.task.points),
                                strengthPoints: firebase.firestore.FieldValue.increment(this.task.points)
                            });
                        break;
                    case 'Flexibility':
                        db.collection('users').doc(this.authUser.uid)
                            .update({
                                points: firebase.firestore.FieldValue.increment(this.task.points),
                                flexPoints: firebase.firestore.FieldValue.increment(this.task.points)
                            });
                        break;
                    default:
                        db.collection('users').doc(this.authUser.uid)
                            .update({points: firebase.firestore.FieldValue.increment(this.task.points)});
                        break;
                }

                bus.$emit('snackbar', 'You have been rewarded ' + this.task.points + ' points!');
            }
        },
        changeTask() {
            if (this.authUser.points > 8) {
                db.collection('users').doc(this.authUser.uid)
                    .update({
                        points: firebase.firestore.FieldValue.increment(-8),
                    })
                    .then(() => {
                        bus.$emit('changeTask', this.task);
                        bus.$emit('snackbar', 'You have used 8 of your points!');
                    });
            } else {
                bus.$emit('snackbar', 'You do not have enough points for this action!')
            }
        }
    },
    computed: {
        userIsOnTask() {
            return this.task.usersOnTask.some(t => {
                return t.uid === this.authUser.uid
            });
        },
        canComplete() {
            if (this.userIsOnTask) {
                let userOnTask = this.task.usersOnTask.find(u => {
                    return u.uid === this.authUser.uid
                });
                if (userOnTask) {
                    let userDate = userOnTask.canComplete.toDate ? userOnTask.canComplete.toDate() : userOnTask.canComplete;

                    return new Date(Date.now()) > userDate;
                }
            }
        },
        completeTime() {
            if (this.userIsOnTask) {
                let userOnTask = this.task.usersOnTask.find(t => {
                    return t.uid === this.authUser.uid
                });
                let date = userOnTask.canComplete.toDate ? userOnTask.canComplete.toDate() : userOnTask.canComplete;
                let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

                if (date.getHours() < 12)
                    return date.getHours() + ':' + minutes + ' AM';

                return (date.getHours() - 12) + ':' + minutes + ' PM';
            }

            return '';
        }
    },

    // language=HTML
    template: `
        <v-card max-width="350" min-width="250" color="secondary">
            <v-list-item three-line>
                <v-list-item-content>
                    <v-list-item-title class="headline mb-1">{{task.category}}</v-list-item-title>
                    <h3 class="mb-2">Points: {{task.points}}</h3>
                    <v-list-item-subtitle>Task: {{task.details}}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-divider horizontal/>
            <v-card-actions>
                <v-btn text color="action"
                       v-if="!userIsOnTask"
                       @click.prevent="startTask">Start Task
                </v-btn>
                <v-btn text color="actionTwo"
                       v-if="userIsOnTask && canComplete"
                       @click.prevent="finishTask">Finish Task
                </v-btn>
                <v-btn text color="grey"
                       v-if="userIsOnTask && !canComplete"
                       disabled>Completable After: {{completeTime}}
                </v-btn>
                <v-spacer/>
                <v-btn text color="action"
                       v-if="!userIsOnTask"
                       @click.prevent="changeTask"
                       :disabled="this.authUser.points < 8">
                    New Random Task</br>(8 points)
                </v-btn>
            </v-card-actions>
        </v-card>
    `
});
//Badge Components
Vue.component('storeBadge', {
    mixins: [userMix],
    props: {
        badge: {required: true},
        disabled: {}
    },
    methods: {
        buyBadge() {
            if (!this.userHasBought()) {
                this.badge.ownedByUsers.push({
                    uid: this.authUser.uid,
                    purchasedOn: new Date()
                });
                db.collection('badges')
                    .doc(this.badge.id)
                    .update({ownedByUsers: this.badge.ownedByUsers});
                db.collection('users')
                    .doc(this.authUser.uid)
                    .update({
                        points: firebase.firestore.FieldValue.increment(this.badge.cost * -1),
                        badgeCount: firebase.firestore.FieldValue.increment(1)
                    });

                bus.$emit('snackbar', this.authUser.displayName + ' now has [ ' + this.badge.title + ' ] !');
            }
        }
    },
    computed: {
        userHasBought() {
            return this.badge.ownedByUsers.some(u => {
                return u.uid === this.authUser.uid;
            });
        },
        calcColor() {
            if (this.userCanAfford)
                return 'actionTwo';

            return 'secondary';
        },
        userCanAfford() {
            return this.authUser.points >= this.badge.cost;
        }
    },

    // language=HTML
    template: `
        <v-card max-width="350" :color="calcColor" :disabled="userHasBought">
            <!--<v-img src="img/buysomeBling.jpg"> Uncomment for some images on the badge-->
            <v-card-title>{{badge.title}}</v-card-title>
            <!--</v-img>-->
            <v-card-subtitle>{{badge.details}}</v-card-subtitle>
            <v-divider horizontal></v-divider>
            <v-card-text>
                <h3>Cost: {{badge.cost}} points</h3>
            </v-card-text>
            <v-divider horizontal></v-divider>
            <v-card-actions>
                <v-btn text
                       color="action"
                       :disabled="!userCanAfford"
                       @click.prevent="buyBadge">Buy Badge
                </v-btn>
            </v-card-actions>
        </v-card>
    `
});
Vue.component('profileBadge', {
    mixins: [userMix],
    props: {
        badge: {required: true}
    },
    computed: {
        userHasBought() {
            return this.badge.ownedByUsers.some(u => {
                return u.uid === this.authUser.uid;
            });
        },
        userCanAfford() {
            return this.authUser.points >= this.badge.cost;
        }
    },
    methods:{
        display(){
            bus.$emit('changeDisplayBadge', this.badge.Display)
        }
    },

    // language=HTML
    template: `
        <v-card max-width="350" color="secondary">
            <!--<v-img src="img/buysomeBling.jpg"> Uncomment for some images on the badge-->
            <v-card-title>{{badge.title}}</v-card-title>
            <!--</v-img>-->
            <v-divider horizontal></v-divider>
            <v-card-subtitle>{{badge.details}}</v-card-subtitle>
            <v-divider horizontal></v-divider>
            <v-card-actions>
                <v-btn text
                       color="action"
                       @click="display">Display Outfit
                </v-btn>
            </v-card-actions>
        </v-card>
    `
});
//Post Components
Vue.component('postMaker', {
    mixins: [userMix],
    data() {
        return {
            subject: '',
            content: '',
            valid: false,
            rules: [
                v => v.length >= 10 || 'Must be more than 10 characters',
                v => v.length <= 100 || 'Must be less than 100 characters',
            ],
            dialog: false
        }
    },
    methods: {
        close() {
            this.dialog = false;
            this.subject = '';
            this.content = '';
            this.$refs.newPost.resetValidation();
        },
        post() {
            let post = new Post();
            post.posterUid = this.authUser.uid;
            post.posterAvatar = this.authUser.photoURL;
            post.posterName = this.authUser.displayName;
            post.subject = this.subject;
            post.content = this.content;
            post.datePosted = new Date();
            post.id = db.collection('posts').doc().id;
            db.collection('posts').doc(post.id).set(post);
            bus.$emit('snackbar', 'You just made a new post!');
            this.close();
        }
    },
    // language=HTML
    template: `
        <v-dialog v-model="dialog"
                  persistent max-width="600px">
            <template v-slot:activator="{ on }">
                <v-btn icon
                       fab
                       v-on="on"
                       bottom
                       class="primary mb-12 ml-2"
                       color="actionTwo"
                       fixed
                       elevation="12"
                       ripple>
                    <v-icon>mdi-plus-thick</v-icon>
                </v-btn>
            </template>
            <v-card color="primary">
                <v-form v-model="valid" ref="newPost" lazy-validation>
                    <v-card-title class="mt-3 headline">Flex on the fools with a new post!</v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Subject"
                                                  v-model="subject"
                                                  :rules="rules"
                                                  background-color="secondary"
                                                  hint="Min length: 10 Characters"
                                                  filled
                                                  validate-on-blur
                                                  placeholder="Witty hook here"
                                                  required></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea label="Content"
                                                v-model="content"
                                                :rules="rules"
                                                background-color="secondary"
                                                hint="Min length: 10 Characters"
                                                filled
                                                validate-on-blur
                                                rows="2"
                                                no-resize
                                                placeholder="Some very intriguing content for other's consumption"
                                                required></v-textarea>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="action" text @click="close">Cancel</v-btn>
                        <v-btn color="action" text @click="post" :disabled="!valid">Post</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    `
});
Vue.component('post', {
    mixins: [userMix],
    props: {
        post: {required: true}
    },
    methods: {
        cutContent(s) {
            if (s.length < 100) {
                return s;
            } else {
                return s.substr(0, 97) + '...';
            }
        },
        dateString(date) {
            date = date.toDate ? date.toDate() : date;
            return date.toLocaleDateString();
        },
        upVote() {
            if (!this.userIsPoster) {
                db.collection('posts')
                    .doc(this.post.id)
                    .update({likes: firebase.firestore.FieldValue.increment(1)});
                db.collection('users')
                    .doc(this.post.posterUid)
                    .update({upVotes: firebase.firestore.FieldValue.increment(1)});
            }
        },
        downVote() {
            if (!this.userIsPoster) {
                db.collection('posts')
                    .doc(this.post.id)
                    .update({dislikes: firebase.firestore.FieldValue.increment(1)});
                db.collection('users')
                    .doc(this.post.posterUid)
                    .update({downVotes: firebase.firestore.FieldValue.increment(1)});
            }
        }
    },
    computed: {
        userIsPoster() {
            return this.authUser && this.post.posterUid === this.authUser.uid;
        }
    },
    // language=HTML
    template: `
        <v-container tag="v-card" class="secondary">
            <v-row no-gutters>
                <v-col cols="11"
                       tag="v-list-item"
                       three-line>
                    <v-list-item-avatar tile
                                        size="80"
                                        class="my-auto mr-3 ml-1"
                                        color="secondary">
                        <v-img :src="post.posterAvatar"></v-img>
                    </v-list-item-avatar>
                    <v-divider vertical/>
                    <v-list-item-content class="ml-3">
                        <v-list-item-title class="title mb-1">
                            {{post.subject}}
                        </v-list-item-title>
                        <v-list-item-subtitle class="body-1">
                            {{cutContent(post.content)}}
                        </v-list-item-subtitle>
                        <div class="overline">Posted by {{post.posterName}} on {{dateString(post.datePosted)}}</div>
                    </v-list-item-content>
                </v-col>
                <v-col cols="1"
                       tag="v-card-actions">
                    <v-row justify="center"
                           no-gutters>
                        <v-chip @click.prevent="upVote"
                                :disabled="userIsPoster"
                                color="gold"
                                class="mx-auto mb-2">
                            <v-icon>mdi-thumb-up</v-icon>
                            {{post.likes}}
                        </v-chip>
                        <v-chip @click.prevent="downVote"
                                :disabled="userIsPoster"
                                color="gold"
                                class="mx-auto mt-2">
                            <v-icon>mdi-thumb-down</v-icon>
                            {{post.dislikes}}
                        </v-chip>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    `
});
