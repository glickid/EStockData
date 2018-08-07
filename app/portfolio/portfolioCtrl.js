app.controller('portfolioCtrl', function ($scope, $location, dataSrv, alertsSrv, userSrv, portfolioSrv) {

    $scope.stockArr = [];
    var userPortfolio = [];

    var activerUser = userSrv.getActiveUser();

    if (activerUser === null) {
        $location.path("/");
    } else {
        userPortfolio = activerUser["portfolio"];
        buildStockArray();
    }

    function buildStockArray() {
        for (var i = 0; i < userPortfolio.length; i++) {
            dataSrv.getStockInfo(userPortfolio[i]["name"], userPortfolio[i]["symbol"], userPortfolio[i])
                .then(function (response) {
                    //var obj = userPortfolio.find(x => x.Symbol === response.symbol)

                    portfolioSrv.buildStockPortfolio(response["returnedParam"], response)
                        .then(function (response1) {
                            $scope.stockArr = response1;
                        }, function (err) {
                            console.log(err);
                        });
                }, function (err) {
                    console.log(err);
                })
        }
    }

    alertsSrv.loadAlerts().then(function (response) {
        //do_nothing
    }, function (err) {
        console.log(err);
    });

    $scope.refreshStock = function (stock) {
        dataSrv.getStockInfo(stock.name, stock.symbol).then(function (response) {
            portfolioSrv.updateStockInPortfolio(stock.name, stock.symbol, response)
                .then(function (response1) {
                    $scope.stockArr = response1;
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
        else {
            $scope.stockList = "";
        }
    }

    $scope.addStockToPortfolio = function (stockName, stockSymbol) {

        var found = false;
        for (var i = 0; i < $scope.stockArr.length; i++) {
            if ($scope.stockArr[i].symbol === stockSymbol) {
                //stock already found in array - bail out
                found = true;
                break;
            }
        }
        if (!found) {
            dataSrv.getStockInfo(stockName, stockSymbol).then(function (response) {
                portfolioSrv.addStockToPortfolio(stockName, stockSymbol, response).then(function (response1) {
                    $scope.stockArr = response1;
                }, function (err) {
                    console.log(err);
                });
            }, function (err) {
                console.log(err);
            });
            $scope.input = "";
        }
        else {
            $scope.input = "Stock already found in portfolio!!!!";
        }
        $scope.stockList = "";

    }


    $scope.removeStock = function (stock) {
        for (var i = 0; i < stock.alertsArr.length; i++) {
            $scope.removeAlert(stock.alertsArr[i]["alertId"], stock.symbol);
        }

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

    $scope.alertPrice = 0;
    $scope.alertType = "";
    $scope.alertCurrentPrice = 0;
    
    $scope.setAlertInfo = function (stock) {
        $scope.alertStock = stock.name;
        $scope.alertSymbol = stock.symbol;
        $scope.alertCurrentPrice = stock.cprice;
    }

    $scope.resetAlertModal = function () {
        $scope.alertStock = "";
        $scope.alertSymbol = "";
        $scope.alertPrice = 0;
        $scope.alertType = "";
    }

    $scope.setStockAlert = function () {
        alertsSrv.setNewAlert(activerUser["id"], $scope.alertType, $scope.alertSymbol, $scope.alertPrice)
            .then(function (response) {
                portfolioSrv.addAlertToStock($scope.alertSymbol, response.id)
                    .then(function (response) {
                        $scope.stockArr = response;
                        $('#stockAlertModal').modal('hide');
                        $scope.resetAlertModal();
                        $scope.getAlertsInfo(symbol);
                    }, function (err) {
                        console.log(err);
                        $('#stockAlertModal').modal('hide');
                        $scope.resetAlertModal();
                    });
            }, function (err) {
                console.log(err);
                $('#stockAlertModal').modal('hide');
                $scope.resetAlertModal();
            });

    }

    $scope.alertsInfoObj = {};

    $scope.getAlertsInfo = function (symbol) {

        // for (var i = 0; i < $scope.stockArr.length; i++) {
        //     if ($scope.stockArr[i].symbol === symbol) {
        //         for (var j = 0; j < $scope.stockArr[i].alertsArr.length; j++) {
        var alertsArr = portfolioSrv.getStockAlertsArr(symbol);
        var stockAlertInfoArr = [];

        for (var j = 0; j < alertsArr.length; j++) {
            alertsSrv.getAlertInfo(alertsArr[j].alertId)
                .then(function (response) {
                    var alertInfo = response;
                    if (alertInfo !== null) {
                        stockAlertInfoArr.push(alertInfo);
                        $scope.alertsInfoObj[symbol] = stockAlertInfoArr;
                    }
                }, function (err) {
                    console.log(err);
                    angular.element(document.querySelector('#' + symbol)).collapse('hide');
                    $scope.alertsInfoObj[symbol] = [];
                });
        }
        
        
    }

    $scope.removeAlert = function (alertId, symbol) {
        alertsSrv.removeAlert(alertId).then(function (response) {
            portfolioSrv.removeAlertFromStock(alertId, symbol).then(function (response1) {
                $scope.stockArr = response1;
                $scope.getAlertsInfo(symbol);
                if ($scope.alertsInfoObj[symbol].length) {
                    angular.element(document.querySelector('#' + symbol)).collapse('hide');
                }
            }, function (err) {
                console.log(err)
            })
        }, function (err) {
            console.log(err);
        });
    }

    $scope.openStockChart = function (stock, period) {
        $location.path("/charts/" + stock.symbol + "/" + period);
    }
});