app.controller('userCtrl', function($scope, $log, userSrv){
    $scope.user = userSrv.getCurrentUser();
})