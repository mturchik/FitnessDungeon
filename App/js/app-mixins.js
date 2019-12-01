const userMix = {
    props: {
        authUser: {required: true},
    },
    methods: {
        login() {
            bus.$emit('Login');
        },
        logout() {
            bus.$emit('Logout');
            router.push({path: '/home'}).then(r => {
                bus.$emit('routeChange', r.path);
            });
        }
    }
};