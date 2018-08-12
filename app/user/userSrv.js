app.factory('userSrv', function ($http, $q) {

    var activeUser = null;//
    //  var activeUser = new User({fname:"Yossi", lname:"G.", id:1, email:"yossi@yossi.com",
    //  "password":"123", "portfolio": [{"Name":"Alphabet Inc. Class A", "Symbol": "GOOGL", 
    //  "purchasePrice": 1225.07, "purchaseDate":"2018-07-31", "alerts": [{"alertId": 1}] }] });

    function User(plainUser) {
        this.fname = plainUser.fname;
        this.lname = plainUser.lname;
        this.email = plainUser.email;
        this.password = plainUser.password;
        this.portfolio = plainUser.portfolio;
    }


    function isLoggedIn() {
        return activeUser ? true : false;
    }

    function logout() {
        activeUser = null;
    }

    function login(email, password) {
        var async = $q.defer();

        var loginURL = "https://estockdata.herokuapp.com/users?email=" + email;

        $http.get(loginURL).then(function (response) {
            //we assume ther would be only one user with this email!!
            if (response.data.length === 0)
            {
                async.reject("Invalid user");
            }
            else if(response.data[0].password === password)
            {
                activeUser = response.data[0];
                async.resolve(activeUser);
            }
            else
            {
                async.reject("Invalid password");
            }
        }, function (err) {
            async.reject(err);
        });

        return async.promise;
    }

    function updateActiveUser() {
        var async = $q.defer();

        var loginURL = "https://estockdata.herokuapp.com/users/" + activeUser.id;

        $http.get(loginURL).then(function (response) {

            activeUser = response.data;
            async.resolve(activeUser);

        }, function (err) {
            async.reject(err);
        });

        return async.promise;
    }
    function getActiveUser() {
        return activeUser;
    }

    function createNewUser(newUser) {
        var newUserREc = new User(newUser);
        var async = $q.defer();

        var loginURL = "https://estockdata.herokuapp.com/users/";

        $http.post(loginURL, newUserREc).then(function (response) {
            //activeUser.id = response.data.id;
            activeUser = null;
            async.resolve(null);
        }, function (err) {
            async.reject(err);
        });

        return async.promise;
    }
    return {
        login: login,
        isLoggedIn: isLoggedIn,
        logout: logout,
        getActiveUser: getActiveUser,
        createNewUser: createNewUser,
        updateActiveUser : updateActiveUser
    }


})