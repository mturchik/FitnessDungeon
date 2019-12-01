// Models //////////////////////////////////////////////////////////////
const User = function (loginUser, firebaseUser) {
    let user = {
        displayName: '',
        uid: '',
        email: '',
        photoURL: '',
        points: 0,
        cardioPoints: 0,
        flexPoints: 0,
        strengthPoints: 0
    };
    //TODO: WE SHOULD ADD PROFILE DETAILS HERE

    if (loginUser) {
        user.displayName = loginUser.displayName ? loginUser.displayName : '';
        user.uid = loginUser.uid ? loginUser.uid : '';
        user.email = loginUser.email ? loginUser.email : '';
        user.photoURL = loginUser.photoURL ? loginUser.photoURL : '';
    }
    if(firebaseUser){
        user.displayName = firebaseUser.fields.displayName ? firebaseUser.fields.displayName.stringValue : '';
        user.uid = firebaseUser.fields.uid ? firebaseUser.fields.uid.stringValue : '';
        user.email = firebaseUser.fields.email ? firebaseUser.fields.email.stringValue : '';
        user.photoURL = firebaseUser.fields.photoURL ? firebaseUser.fields.photoURL.stringValue : '';
        user.points = firebaseUser.fields.points ? parseInt(firebaseUser.fields.points.integerValue) : 0;
        user.cardioPoints = firebaseUser.fields.cardioPoints ? parseInt(firebaseUser.fields.cardioPoints.integerValue) : 0;
        user.flexPoints = firebaseUser.fields.flexPoints ? parseInt(firebaseUser.fields.flexPoints.integerValue) : 0;
        user.strengthPoints = firebaseUser.fields.strengthPoints ? parseInt(firebaseUser.fields.strengthPoints.integerValue) : 0;
    }

    return user;
};
const Task = function (firebaseTask) {
    let task = {
        id: '',
        category: '',
        details: '',
        points: 0,
        usersOnTask: []
    };

    if (firebaseTask) {
        task.id = firebaseTask.name ? firebaseTask.name.substr(firebaseTask.name.lastIndexOf('/') + 1) : '';
        task.category = firebaseTask.fields.category ? firebaseTask.fields.category.stringValue : '';
        task.details = firebaseTask.fields.details ? firebaseTask.fields.details.stringValue : '';
        task.points = firebaseTask.fields.points ? parseInt(firebaseTask.fields.points.integerValue) : 0;
        //if the array exists, and there are values in it, add them
        if (firebaseTask.fields.usersOnTask && firebaseTask.fields.usersOnTask.arrayValue.values) {
            let users = [];
            firebaseTask.fields.usersOnTask.arrayValue.values.forEach(v => {
                let map = v.mapValue.fields;
                let user = {
                  uid: map.uid.stringValue,
                  canComplete: new Date(map.canComplete.timestampValue)
                };
                users.push(user);
            });
            task.usersOnTask = users;
        } else //or blank it out!
            task.usersOnTask = [];
    }

    return task;
};
const Badge = function (firebaseBadge){
    let badge = {
        id: '',
        title: '',
        details: '',
        cost: 0,
        ownedByUsers: []
    };

    if(firebaseBadge){
        badge.id = firebaseBadge.name ? firebaseBadge.name.substr(firebaseBadge.name.lastIndexOf('/') + 1) : '';
        badge.title = firebaseBadge.fields.title ? firebaseBadge.fields.title.stringValue : '';
        badge.details = firebaseBadge.fields.details ? firebaseBadge.fields.details.stringValue : '';
        badge.cost = firebaseBadge.fields.cost ? parseInt(firebaseBadge.fields.cost.integerValue) : 0;
        //if the array exists, and there are values in it, add them
        if (firebaseBadge.fields.ownedByUsers && firebaseBadge.fields.ownedByUsers.arrayValue.values) {
            let users = [];
            firebaseBadge.fields.ownedByUsers.arrayValue.values.forEach(v => {
                let map = v.mapValue.fields;
                let user = {
                    uid: map.uid.stringValue,
                    purchasedOn: new Date(map.purchasedOn.timestampValue)
                };
                users.push(user);
            });
            badge.ownedByUsers = users;
        } else //or blank it out!
            badge.ownedByUsers = [];
    }

    return badge;
};
////////////////////////////////////////////////////////////////////////
//Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyA6tBBf4Q4sJqg9EerEyRp-QPBAK_cs2kg",
    authDomain: "fitnessdungeon-d40e4.firebaseapp.com",
    databaseURL: "https://fitnessdungeon-d40e4.firebaseio.com",
    projectId: "fitnessdungeon-d40e4",
    storageBucket: "fitnessdungeon-d40e4.appspot.com",
    messagingSenderId: "737505878722",
    appId: "1:737505878722:web:244fa378a0ee32aefb115b",
    measurementId: "G-4F2NXL7C1X"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore through Firebase
const db = firebase.firestore();
// Init Vue Modules
Vue.use(Vuetify);
Vue.use(Vuefire);