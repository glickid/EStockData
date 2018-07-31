app.controller('portfolioCtrl', function ($scope, $location, dataSrv, configSrv, userSrv, portfolioSrv) {

    $scope.stock = "AAA";

    var activerUser = userSrv.getActiveUser();
    if (activerUser === null) {
        $location.path("#!/");
    }

    $scope.searchStock = function (searchStr) {
        if (searchStr.length > 2) {
            portfolioSrv.searchStock(searchStr).then(function (response) {
                $scope.stockList = response;
            }, function (err) {
                console.log(err);
            })
        }
    }
});