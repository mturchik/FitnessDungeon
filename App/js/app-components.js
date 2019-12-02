//Misc Components
Vue.component('navigation', {
    mixins: [userMix],
    data() {
        return {
            bottomNav: 0
        }
    },
    computed: {},
    mounted() {
        bus.$on('routeChange', (path) => {
            switch (path) {
                case '/':
                case '/home':
                    this.bottomNav = 0;
                    break;
                case '/dungeon':
                    this.bottomNav = 1;
                    break;
                case '/profile':
                    this.bottomNav = 2;
                    break;
                case '/forum':
                    this.bottomNav = 3;
                    break;
                case '/shop':
                    this.bottomNav = 4;
                    break;
                case '/leaderBoard':
                    this.bottomNav = 5;
                    break;
                default:
                    this.bottomNav = 0;
                    break;
            }
        })
    },
    // language=HTML
    template: `
        <v-bottom-navigation background-color="primary"
                             v-model="bottomNav"
                             app
                             mandatory>
            <router-link to="/home" tag="v-btn">
                <span>Home</span>
                <v-icon>mdi-home</v-icon>
            </router-link>
            <router-link to="/dungeon" tag="v-btn" :disabled="!authUser">
                <span>Dungeon</span>
                <v-icon>mdi-castle</v-icon>
            </router-link>
            <router-link to="/profile" tag="v-btn" :disabled="!authUser">
                <span>Profile</span>
                <v-icon>mdi-face-profile</v-icon>
            </router-link>
            <router-link to="/forum" tag="v-btn" :disabled="!authUser">
                <span>Forum</span>
                <v-icon>mdi-forum</v-icon>
            </router-link>
            <router-link to="/shop" tag="v-btn" :disabled="!authUser">
                <span>Shop</span>
                <v-icon>mdi-basket</v-icon>
            </router-link>
            <router-link to="/leaderBoard" tag="v-btn">
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
    props: {},
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
    mounted() {
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
                    v-model="snackbar"
                    :timeout="timeout">
            <h1>{{message}}</h1>
            <v-btn color="action"
                   text
                   @click="snackbar = false">Close
            </v-btn>
        </v-snackbar>
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
            bus.$emit('startTask', this.task);
        },
        finishTask() {
            bus.$emit('finishTask', this.task);
        }
    },
    computed: {
        userIsOnTask() {
            return this.task.usersOnTask.some(t => {
                return t.uid === this.authUser.uid
            });
        },
        canComplete() {
            let date = new Date();
            let userOnTask = this.task.usersOnTask.find(u => {
                return u.uid === this.authUser.uid
            });
            if (userOnTask) {
                return date > userOnTask.canComplete;
            }
            return false;
        },
        completeTime() {
            let d = this.task.usersOnTask.find(t => {
                return t.uid === this.authUser.uid
            }).canComplete;

            let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();

            if (d.getHours() < 12)
                return d.getHours() + ':' + minutes + ' AM';

            return (d.getHours() - 12) + ':' + minutes + ' PM';
        }
    },

    // language=HTML
    template: `
        <v-card max-width="350" min-width="250" color="primary">
            <v-list-item three-line>
                <v-list-item-content>
                    <div class="overline mb-4">Points: {{task.points}}</div>
                    <v-list-item-title class="headline mb-1">{{task.category}}</v-list-item-title>
                    <v-list-item-subtitle>Task: {{task.details}}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-card-actions>
                <v-btn text color="action"
                       v-if="!userIsOnTask"
                       @click="startTask">Start Task
                </v-btn>
                <v-btn text color="actionTwo"
                       v-if="userIsOnTask && canComplete"
                       @click="finishTask">Finish Task
                </v-btn>
                <v-btn text color="grey"
                       v-if="userIsOnTask && !canComplete"
                       disabled>Completable After: {{completeTime}}
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
            bus.$emit('buyBadge', this.badge);
        }
    },
    computed: {
        userHasBought() {
            return this.badge.ownedByUsers.some(u => {
                return u.uid === this.authUser.uid;
            });
        },
        calcColor() {
            if (this.userHasBought)
                return 'tertiary';
            if (this.userCanAfford)
                return 'actionTwo';

            return 'primary';
        },
        userCanAfford() {
            return this.authUser.points >= this.badge.cost;
        }
    },

    // language=HTML
    template: `
        <v-card max-width="350" min-width="250" :color="calcColor" :disabled="userHasBought">
            <v-list-item three-line>
                <v-list-item-content>
                    <div class="overline mb-4">Cost: {{badge.cost}} points</div>
                    <v-list-item-title class="headline mb-1">{{badge.title}}</v-list-item-title>
                    <v-list-item-subtitle>Details: {{badge.details}}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-card-actions>
                <v-btn text
                       color="action"
                       :disabled="!userCanAfford"
                       @click="buyBadge">Buy Badge
                </v-btn>
            </v-card-actions>
        </v-card>
    `
});
Vue.component('profileBadge', {
    mixins: [userMix],
    props: {
        badge: {required: true},
        disabled: {}
    },
    methods: {
        buyBadge() {
            bus.$emit('buyBadge', this.badge);
        }
    },
    computed: {
        userHasBought() {
            return this.badge.ownedByUsers.some(u => {
                return u.uid === this.authUser.uid;
            });
        },
        calcColor() {
            if (this.userHasBought)
                return 'tertiary';
            if (this.userCanAfford)
                return 'actionTwo';

            return 'primary';
        },
        userCanAfford() {
            return this.authUser.points >= this.badge.cost;
        }
    },

    // language=HTML
    template: `
        <v-card max-width="350" min-width="250" :color="calcColor" :disabled="userHasBought">
            <v-list-item three-line>
                <v-list-item-content>
                    <div class="overline mb-4">Cost: {{badge.cost}} points</div>
                    <v-list-item-title class="headline mb-1">{{badge.title}}</v-list-item-title>
                    <v-list-item-subtitle>Details: {{badge.details}}</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-card-actions>
                <v-btn text
                       color="action"
                       :disabled="!userCanAfford"
                       @click="buyBadge">Buy Badge
                </v-btn>
            </v-card-actions>
        </v-card>
    `
});
//Post Components
Vue.component('postMaker', {
    mixins: [userMix],
    props: {
        parentPostId: {required: false}
    },
    data() {
        return {
            subject: '',
            content: '',
            valid: false,
            rules: [
                v => !!v || 'Required',
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
            if (this.parentPostId)
                post.parentPostId = this.parentPostId;
            post.posterUid = this.authUser.uid;
            post.posterAvatar = this.authUser.photoURL;
            post.posterName = this.authUser.displayName;
            post.subject = this.subject;
            post.content = this.content;
            post.datePosted = new Date();
            bus.$emit('newPost', post);
            this.close();
        }
    },
    watch: {},
    mounted() {
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
                <v-form v-model="valid" ref="newPost">
                    <v-card-title class="mt-3">
                        <span class="headline">New Forum Post</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Subject"
                                                  v-model="subject"
                                                  :rules="rules"
                                                  outlined
                                                  placeholder="Witty hook here"
                                                  required></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea label="Content"
                                                v-model="content"
                                                :rules="rules"
                                                outlined
                                                counter
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
            return date.toLocaleDateString();
        },
        upVote() {
            bus.$emit('upVote', this.post);
        },
        downVote() {
            bus.$emit('downVote', this.post);
        }
    },
    // language=HTML
    template: `
        <v-container tag="v-card" class="primary">
            <v-row no-gutters>
                <v-col cols="11"
                       tag="v-list-item"
                       two-line>
                    <v-list-item-avatar tile
                                        size="80"
                                        class="ml-6"
                                        color="secondary">
                        <v-img :src="post.posterAvatar"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <div class="overline mb-4">Posted by {{post.posterName}} on {{dateString(post.datePosted)}}
                        </div>
                        <v-list-item-title class="headline mb-1">
                            {{post.subject}}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{cutContent(post.content)}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-col>
                <v-col cols="1"
                       tag="v-card-actions">
                    <v-row class="flex-column ma-0 fill-height"
                           justify="center">
                        <v-col class="p-0 m-0">
                            <v-btn text @click.prevent="upVote">
                                <v-icon>mdi-thumb-up</v-icon>
                                {{post.likes}}
                            </v-btn>
                        </v-col>
                        <v-col class="p-0 m-0">
                            <v-btn text @click.prevent="downVote">
                                <v-icon>mdi-thumb-down</v-icon>
                                {{post.dislikes}}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    `
});