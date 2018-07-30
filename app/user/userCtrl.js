app.controller('userCtrl', function ($scope, $log, $location, userSrv) {
    $scope.user = userSrv.getActiveUser();

    $scope.email = "yyy@yyy.com";
    $scope.password = "";
    $scope.invalidLogin = false;
    $scope.errorMessage = "";

    $scope.login = function () {
        $scope.invalidLogin = false;
        userSrv.login($scope.email, $scope.password).then(function (activeUser) {
            $location.path("#!/");
            $('#SignInModal').modal('hide');
        }, function () {
            $scope.invalidLogin = true;
            $scope.errorMessage = "Invalid Username or password!";
        })
    }
})