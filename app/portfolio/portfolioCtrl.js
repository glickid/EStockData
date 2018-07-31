app.controller('portfolioCtrl', function ($scope, $location, dataSrv, configSrv, userSrv, portfolioSrv) {

    $scope.stockArr= [];

    // $scope.stockArr = loadUserPortfolio()

    var activerUser = userSrv.getActiveUser();
    if (activerUser === null) {
        $location.path("#!/");
    }

    $scope.searchStock = function (searchStr) {
        if (searchStr.length > 2) {
            portfolioSrv.searchStock(searchStr).then(function (response) {
                $scope.stockList = response;
            }, function (err) {;
                console.log(err);
                $scope.stockList = "";
            })
        }
    }

    $scope.addStockToPortfolio = function(stockSymbol) {
        $scope.stockArr.push({"Name":"apple","Symbol":"APP","dayProfit":"2%","overallProfit":"3%",
        "purchasePrice":200,"currentPrice":300,"dayVolume":232323});
        $scope.stockList = "";
    }

    $scope.removeStock = function(stock) {
        var index = $scope.stockArr.indexOf(stock);
        $scope.stockArr.splice(index,1);
    }
});