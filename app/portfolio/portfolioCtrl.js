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
                    $scope.stockArr = response1;
                    // var obj = userPortfolio.find(x => x.Symbol === response1.symbol);
                    // if (obj) {
                    //     $scope.stockArr.push({
                    //         "Name": response1.name, "Symbol": response1.symbol,
                    //         "dayChange": response1.dayChange(), "overallProfit": response1.overallProfit(),
                    //         "purchasePrice": obj["purchasePrice"],
                    //         "purchaseDate": obj["purchaseDate"],
                    //         "currentPrice": response1.cprice,
                    //         "dayVolume": response1.dvolume
                    //     });
                    // }
                }, function (err) {
                    console.log(err);
                });

        }, function (err) {
            console.log(err);
        })
    }

    $scope.refreshStock = function (stock) {
        dataSrv.getStockInfo(stock.name, stock.symbol).then(function (response) {
            portfolioSrv.updateStockInPortfolio(stock.name, stock.symbol, response)
                .then(function (response1) {
                    $scope.stockArr = response1;
                    // for (var index = 0; index < $scope.stockArr.length; index++) {
                    //     if ($scope.stockArr[index]["Symbol"] === response1.symbol) {
                    //         $scope.stockArr[index]["currentPrice"] = response1.cprice;
                    //         $scope.stockArr[index]["dayVolume"] = response1.dvolume;
                    //         $scope.stockArr[index]["dayChange"] = response1.dayChange();
                    //         $scope.stockArr[index]["overallProfit"] = response1.overallProfit();
                    //         break;
                    //     }
                    // }
                }, function (err) {
                    console.log(err);
                });
        }, function (err) {
            console.log(err);
        });
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
                $scope.stockArr = response1;
            }, function (err) {
                console.log(err);
            });
        }, function (err) {
            console.log(err);
        });
        $scope.stockList = "";
        $scope.input = "";
    }


    $scope.removeStock = function (stock) {
        portfolioSrv.removeStockFromPortfolio(stock.name, stock.symbol).then(function (response1) {
            $scope.stockArr = response1;
        }, function (err) {
            console.log(err);
        });
    }

    $scope.stockInfo = {};

    $scope.getStockInfo = function (stock) {
        dataSrv.getStockStats(stock.symbol).then(function (response) {

            $scope.stockInfo["Name"] = response.data.companyName;
            $scope.stockInfo["Symbol"] = response.data.symbol;
            $scope.stockInfo["marketcap"] = response.data.marketcap
            $scope.stockInfo["beta"] = response.data.beta
            $scope.stockInfo["week52high"] = response.data.week52high
            $scope.stockInfo["week52low"] = response.data.week52low;
            $scope.stockInfo["week52change"] = response.data.week52change;
            $scope.stockInfo["shortInterest"] = response.data.shortInterest;
            $scope.stockInfo["shortDate"] = response.data.shortDate;
            $scope.stockInfo["dividendRate"] = response.data.dividendRate;
            $scope.stockInfo["dividendYield"] = response.data.dividendYield;
            $scope.stockInfo["exDividendDate"] = response.data.exDividendDate;
            $scope.stockInfo["latestEPS"] = response.data.latestEPS;
            $scope.stockInfo["latestEPSDate"] = response.data.latestEPSDate;
            $scope.stockInfo["sharesOutstanding"] = response.data.sharesOutstanding
            $scope.stockInfo["float"] = response.data.float;
            $scope.stockInfo["returnOnEquity"] = response.data.returnOnEquity;
            $scope.stockInfo["consensusEPS"] = response.data.consensusEPS;
            $scope.stockInfo["numberOfEstimates"] = response.data.numberOfEstimates;
            $scope.stockInfo["EPSSurpriseDollar"] = response.data.EPSSurpriseDollar;
            $scope.stockInfo["EPSSurprisePercent"] = response.data.EPSSurprisePercent;
            $scope.stockInfo["EBITDA"] = response.data.EBITDA;
            $scope.stockInfo["revenue"] = response.data.revenue;
            $scope.stockInfo["grossProfit"] = response.data.grossProfit;
            $scope.stockInfo["cash"] = response.data.cash;
            $scope.stockInfo["debt"] = response.data.debt;
            $scope.stockInfo["ttmEPS"] = response.data.ttmEPS;
            $scope.stockInfo["revenuePerShare"] = response.data.revenuePerShare;
            $scope.stockInfo["revenuePerEmployee"] = response.data.revenuePerEmployee;
            $scope.stockInfo["peRatioHigh"] = response.data.peRatioHigh;
            $scope.stockInfo["peRatioLow"] = response.data.peRatioLow;
            $scope.stockInfo["returnOnAssets"] = response.data.returnOnAssets;
            $scope.stockInfo["returnOnCapital"] = response.data.returnOnCapital;
            $scope.stockInfo["profitMargin"] = response.data.profitMargin;
            $scope.stockInfo["priceToSales"] = response.data.priceToSales;
            $scope.stockInfo["priceToBook"] = response.data.priceToBook;
            $scope.stockInfo["day200MovingAvg"] = response.data.day200MovingAvg;
            $scope.stockInfo["day50MovingAvg"] = response.data.day50MovingAvg;
            $scope.stockInfo["institutionPercent"] = response.data.institutionPercent;
            $scope.stockInfo["insiderPercent"] = response.data.insiderPercent;
            $scope.stockInfo["shortRatio"] = response.data.shortRatio;
            $scope.stockInfo["year5ChangePercent"] = response.data.year5ChangePercent;
            $scope.stockInfo["year2ChangePercent"] = response.data.year2ChangePercent;
            $scope.stockInfo["year1ChangePercent"] = response.data.year1ChangePercent;
            $scope.stockInfo["ytdChangePercent"] = response.data.ytdChangePercent;
            $scope.stockInfo["month6ChangePercent"] = response.data.month6ChangePercent;
            $scope.stockInfo["month3ChangePercent"] = response.data.month3ChangePercent;
            $scope.stockInfo["month1ChangePercent"] = response.data.month1ChangePercent;
            $scope.stockInfo["day5ChangePercent"] = response.data.day5ChangePercent;
            $scope.stockInfo["day30ChangePercent"] = response.data.day30ChangePercent;
        }, function (err) {
            console.log(err);
        });
    }

    $scope.setStockAlert = function (stock) {

    }
});