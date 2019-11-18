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
Vue.component('category', {
    mixins: [userMix],

    props: {
        category: {required: true}
    },
    methods: {},

    // language=HTML
    template: `
        <v-card shaped color="primary">
            <v-card-title>{{category.CategoryName}} - Bonus Points: {{category.BonusPoints}}</v-card-title>
            <v-list dense color="primary">
                <task v-for="(task, i) in category.tasks"
                      :key="i"
                      :task="task"
                      :auth-user="authUser"/>
            </v-list>
        </v-card>
    `
});

Vue.component('task', {
    mixins: [userMix],

    props: {
        task: {required: true}
    },
    methods: {
        checkUserOnTask(task) {
            return task.usersOnTask.includes(this.authUser.uid);
        }
    },

    // language=HTML
    template: `
        <v-list-item two-line>
            <v-list-item-content>
                <v-list-item-title>Task: {{task.task}}</v-list-item-title>
                <v-list-item-subtitle>Points: {{task.points}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action v-if="checkUserOnTask(task)">
                <v-btn icon>
                    <v-icon color="action">mdi-information</v-icon>
                </v-btn>
            </v-list-item-action>
        </v-list-item>
    `
});