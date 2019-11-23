Vue.component('navigation', {
    mixins: [userMix],

    // language=HTML
    template: `
        <v-app-bar color="primary" app dense>
            <v-menu right bottom>
                <template v-slot:activator="{ on: menu }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                            <v-app-bar-nav-icon v-on="{ ...tooltip, ...menu }"></v-app-bar-nav-icon>
                        </template>
                        <span>Navigation</span>
                    </v-tooltip>
                </template>
                <v-divider></v-divider>
                <v-list dense
                        rounded>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>
                                Fitness Dungeon
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                Get Fit Or Die Trying
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <router-link to="/home" tag="v-list-item">
                        <v-list-item-icon>
                            <v-icon>mdi-home</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Home</v-list-item-title>
                        </v-list-item-content>
                    </router-link>
                    <router-link to="/dungeon" tag="v-list-item">
                        <v-list-item-icon>
                            <v-icon>mdi-castle</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Dungeon</v-list-item-title>
                        </v-list-item-content>
                    </router-link>
                    <router-link to="/leaderBoard" tag="v-list-item">
                        <v-list-item-icon>
                            <v-icon>mdi-bulletin-board</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Leaderboard</v-list-item-title>
                        </v-list-item-content>
                    </router-link>
                    <router-link to="/profile" tag="v-list-item">
                        <v-list-item-icon>
                            <v-icon>mdi-face-profile</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Profile</v-list-item-title>
                        </v-list-item-content>
                    </router-link>
                    <router-link to="/forum" tag="v-list-item">
                        <v-list-item-icon>
                            <v-icon>mdi-forum</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Forum</v-list-item-title>
                        </v-list-item-content>
                    </router-link>
                    <router-link to="/shop" tag="v-list-item">
                        <v-list-item-icon>
                            <v-icon>mdi-basket</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Shop</v-list-item-title>
                        </v-list-item-content>
                    </router-link>
                </v-list>
            </v-menu>
            <v-toolbar-title>Fit-Livion</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip left v-if="authUser">
                <template v-slot:activator="{ on: tooltip }">
                    <v-avatar class="mr-4" size="36" v-on="tooltip">
                        <v-img :src="authUser.photoURL"
                               class="d-none d-sm-flex"
                               alt="avatar"/>
                    </v-avatar>
                </template>
                <span>{{authUser.displayName}}</span>
            </v-tooltip>
            <v-btn @click.prevent="logout"
                   color="action"
                   class="ml-2"
                   v-if="authUser">Log Out
            </v-btn>
            <v-btn @click.prevent="login"
                   color="action"
                   class="ml-2"
                   v-else>Log In
            </v-btn>
        </v-app-bar>
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
        <v-card max-width="350" min-width="250">
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
                <v-btn text color="action"
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