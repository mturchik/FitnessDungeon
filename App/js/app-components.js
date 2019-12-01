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
Vue.component('snack', {
    props: {},
    data() {
        return {
            snackbar: false,
            timeout: 50000,
            message: ''
        }
    },
    methods: {},
    watch: {
        snackbar: function (newVal) {
            if (!newVal) {
                this.message = '';
            }
        }
    },
    mounted() {
        bus.$on('snackbar', (message) => {
           this.message = message;
           this.snackbar = true;
        });
    },

    // language=HTML
    template: `
        <v-snackbar bottom
                    absolute
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