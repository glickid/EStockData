app.factory('userSrv', function ($http, $q) {

    //var activeUser = null;//
     var activeUser = null; //new User({fname:"Yossi", lname:"G.", id:"1", email:"yossi@yossi.com"});

    function User(plainUser) {
        this.fname = plainUser.fname;
        this.lname = plainUser.lname;
        this.email = plainUser.email;
        this.id = plainUser.id;
    }


    function isLoggedIn() {
        return activeUser ? true : false;
    }

    function logout() {
        activeUser = null;
    }

    function login(email, password) {
        var async = $q.defer();

        //var loginURL = "app/db.json/users?email=" + email + "&password=" + password;
        var loginURL = "app/db.json";
        $http.get(loginURL).then(function (response) {

            for (var i = 0; i<response.data.users.length; i++) {
                if ((response.data.users[i].email === email) &&
                    (response.data.users[i].password === password)) {
                    activeUser = new User(response.data.users[i]);
                    async.resolve(activeUser);
                    break;
                }
            }
            // else {
            if (!activeUser)
                async.reject("invalid credentials");
            // }
        }, function (err) {
            async.reject(err);
        });

        return async.promise;
    }

    function getActiveUser() {
        return activeUser;
    }

    function createNewUser (newUser) {
        activeUser = new User(newUser);

        // var async = $q.defer();

        //var loginURL = "app/db.json/users?email=" + email + "&password=" + password;
        // var loginURL = "app/db.json/users";
        // $http.post(activeUser).then(function (response) {
        //     async.resolve(activeUser);
        // }, function (err) {
        //     async.reject(err);
        // });

        // return async.promise;
    }
    return {
        login: login,
        isLoggedIn: isLoggedIn,
        logout: logout,
        getActiveUser: getActiveUser,
        createNewUser : createNewUser
    }


})