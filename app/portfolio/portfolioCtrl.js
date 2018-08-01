app.controller('portfolioCtrl', function ($scope, $location, dataSrv, configSrv, userSrv, portfolioSrv) {

    $scope.stockArr = [];

    // $scope.stockArr = loadUserPortfolio()

    var activerUser = userSrv.getActiveUser();
    if (activerUser === null) {
        $location.path("#!/");
    }

    var userPortfolio = activerUser["portfolio"];
    // if (userPortfolio.length !=0)
    // {

    for (var i = 0; i < userPortfolio.length; i++) {
        dataSrv.getStockInfo(userPortfolio[i]["Name"], userPortfolio[i]["Symbol"]).then(function (response) {
            var obj = userPortfolio.find(x => x.Symbol === response.symbol)
            portfolioSrv.buildStockPortfolio(obj, response)
                .then(function (response1) {
                    var obj = userPortfolio.find(x => x.Symbol === response1.symbol);
                    if (obj) {
                        $scope.stockArr.push({
                            "Name": response1.name, "Symbol": response1.symbol,
                            "dayChange": response1.dayChange(), "overallProfit": response1.overallProfit(),
                            "purchasePrice": obj["purchasePrice"],
                            "purchaseDate": obj["purchaseDate"],
                            "currentPrice": response1.cprice,
                            "dayVolume": response1.dvolume
                        });
                    }
                }, function (err) {
                console.log(err);
            });

    }, function (err) {
        console.log(err);
    })
    }

$scope.searchStock = function (searchStr) {
    if (searchStr.length > 1) {
        dataSrv.searchStock(searchStr).then(function (response) {
            $scope.stockList = response;
        }, function (err) {
            console.log(err);
            $scope.stockList = "";
        })
    }
}

$scope.addStockToPortfolio = function (stockName, stockSymbol) {

    dataSrv.getStockInfo(stockName, stockSymbol).then(function (response) {
        portfolioSrv.addStockToPortfolio(stockName, stockSymbol, response).then(function (response1) {
            $scope.stockArr.push({
                "Name": response1.name, "Symbol": response1.symbol,
                "dayChange": response1.dayChange(), "overallProfit": response1.overallProfit(),
                "purchasePrice": response1.pprice, "purchaseDate": response1.pdate,
                "currentPrice": response1.cprice,
                "dayVolume": response1.dvolume
            });
        }, function (err) {
            console.log(err);
        });
    }, function (err) {
        console.log(err);
    });

    $scope.stockList = "";
}

$scope.removeStock = function (stock) {
    var index = $scope.stockArr.indexOf(stock);
    $scope.stockArr.splice(index, 1);
}
});