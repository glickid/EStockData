app.controller('userCtrl', function ($scope, $log, $location, userSrv, alertsSrv) {
    $scope.user = userSrv.getActiveUser();

    resetLoginModalScopeInfo();

    function resetLoginModalScopeInfo() {
        $scope.email = "";
        $scope.password = "";
        $scope.fname = "";
        $scope.lname = "";
        $scope.invalidLogin = false;
        $scope.errorMessage = "";
    }

    $scope.signup = function () {
        var newUser = { "fname": $scope.fname, "lname": $scope.lname, "email": $scope.email, 
                        "password": $scope.password, "portfolio":[]};
        userSrv.createNewUser(newUser);
        $location.path("#!/");
        resetLoginModalScopeInfo();
    }

    $scope.login = function () {
        $scope.invalidLogin = false;
        userSrv.login($scope.email, $scope.password).then(function (activeUser) {
            $location.path("#!/");
            $('#loginModal').modal('hide');
            resetLoginModalScopeInfo();
            alertsSrv.loadAlerts().then(function (response) {
                //do_nothing
            }, function (err) {
                console.log(err);
            });
        }, function (err) {
            console.log(err);
            $scope.invalidLogin = true;
            $scope.errorMessage = "Invalid Username or password!";
        })
    }

    $scope.resetLoginModal = function () {
        resetLoginModalScopeInfo();
        // $('#loginModal').modal('hide');
    }
})