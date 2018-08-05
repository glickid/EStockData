app.controller("navbarCtrl", function ($scope, userSrv, alertsSrv, $interval, $location) {

    var activeUser = userSrv.getActiveUser();

    $scope.isUserLoggedIn = function () {
        return userSrv.isLoggedIn();
    }

    $scope.logout = function () {
        userSrv.logout();
        $location.path("/");
    }

    $interval(function () {
        if (userSrv.isLoggedIn()) {
            $scope.alertNum = alertsSrv.getNumOfAlertsforUser(activeUser.id);
        }
        else {
            $scope.alertNum = 0;
        }
    }, 4000);
})