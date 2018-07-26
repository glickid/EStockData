app.factory('userSrv', function($http, $q) {
    var user = "yyy";

    function getCurrentUser(){
        return user;
    }

    return {
        getCurrentUser : getCurrentUser
    }
})