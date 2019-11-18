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
        }
    }
};