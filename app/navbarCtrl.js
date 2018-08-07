app.controller("navbarCtrl", function ($scope, userSrv, alertsSrv, $interval, $location) {
    var activeUser = null;
    
    $scope.isUserLoggedIn = function () {
        return userSrv.isLoggedIn();
    }

    $scope.logout = function () {
        userSrv.logout();
        $location.path("/");
    }

    $interval(function () {
        if (userSrv.isLoggedIn()) {
            activeUser = userSrv.getActiveUser();
            alertsSrv.getNumOfAlertsforUser(activeUser.id).then(function(response){
                $scope.alertNum = response;
            }, function(err){
                console.log(err);
            })
        }
        else {
            $scope.alertNum = 0;
        }
    }, 4000);
})