app.controller('userCtrl', function ($scope, $log, $location, userSrv) {
    $scope.user = userSrv.getActiveUser();

    resetScopeInfo();

    function resetScopeInfo ()
    {
    $scope.email = "";
    $scope.password = "";
    $scope.fname = "";
    $scope.lname = "";
    $scope.invalidLogin = false;
    $scope.errorMessage = "";
    }

    $scope.signup = function () {
        var newUser = { "fname": $scope.fname, "lname": $scope.lname, "email": $scope.email, "password": $scope.password }
        userSrv.createNewUser(newUser);
        $location.path("#!/");
        resetScopeInfo();
    }

    $scope.login = function () {
        $scope.invalidLogin = false;
        userSrv.login($scope.email, $scope.password).then(function (activeUser) {
            $location.path("#!/");
            $('#SignInModal').modal('hide');
            resetScopeInfo();
        }, function () {
            $scope.invalidLogin = true;
            $scope.errorMessage = "Invalid Username or password!";
        })
    }

    $scope.resetModal = function () {
        resetScopeInfo();
        // $('#SignInModal').modal('hide');
    }
})