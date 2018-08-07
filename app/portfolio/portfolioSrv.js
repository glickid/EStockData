app.factory('portfolioSrv', function ($http, $q, $log, configSrv, userSrv) {

    var maxStockNameLen = configSrv.getMaxStcokNameLen();


    function Stock(name, symbol, purchasePrice, purchaseDate, CurrentPrice, dayVolume, dayOpen, alerts) {
        this.name = shorten(name, maxStockNameLen);
        this.symbol = symbol.replace(".", "-");
        this.pprice = purchasePrice;
        this.pdate = purchaseDate;
        this.cprice = CurrentPrice;
        this.dvolume = dayVolume;
        this.dopen = dayOpen;
        this.dayChange = calcDayChange(this);
        this.overallProfit = calcOverallProfit(this)
        this.alertsArr = alerts;
    }

    var stockArr = [];

    function shorten(str, maxLen, separator = ' ') {
        if (str.length <= maxLen)
            return str;
        return str.substr(0, str.lastIndexOf(separator, maxLen));
    }

    function calcDayChange(stock) {
        var num = (((stock.cprice - stock.dopen) / stock.dopen) * 100);
        return num.toFixed(2);
    }

    function calcOverallProfit(stock) {
        var num = (((stock.cprice - stock.pprice) / stock.pprice) * 100);
        return num.toFixed(2);
    }

    function buildStockPortfolio(obj, infoObj) {
        //build the local array - server is already up-to-date at this stage
        var async = $q.defer();

        var updated = false;
        for (var i = 0; i < stockArr.length; i++) {

            if (stockArr[i].symbol === infoObj["symbol"]) {

                stockArr[i].cprice = infoObj["currentPrice"];
                stockArr[i].dvolume = infoObj["dayVolume"];
                stockArr[i].dayOpen = infoObj["openPrice"];
                stockArr[i].alerts = obj.alerts;

                updated = true;
                break;
            }
        }
        if (!updated) //need to add to array
        {
            var stock = new Stock(obj["name"], obj["symbol"], obj["pprice"], obj["pdate"],
                infoObj["currentPrice"], infoObj["dayVolume"], infoObj["openPrice"], obj["alertsArr"]);
            stockArr.push(stock);
        }

        async.resolve(stockArr);

        return async.promise;
    }

    function calcCurrentDate() {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return "" + year + "-" + month + "-" + day;
    }

    function addStockToPortfolio(stockName, stockSymbol, infoObj) {

        var async = $q.defer();

        var stock = new Stock(stockName, stockSymbol, infoObj["currentPrice"], calcCurrentDate(), infoObj["currentPrice"],
            infoObj["dayVolume"], infoObj["openPrice"], []);

        var activeUser = userSrv.getActiveUser();

        if (activeUser.id) {
            var url = "https://estockdata.herokuapp.com/users/" + activeUser.id;

            activeUser.portfolio.push(stock);
            $http.put(url, activeUser).then(function (success) {
                userSrv.updateActiveUser().then(function(response1){
                    stockArr.push(stock);
                    async.resolve(stockArr);
                });
            }, function(err) {
                $log.error(err);
            });
        }
        else {
            //oops, something very wrong here!
            async.reject("user does not have an id!!")
        }

        return async.promise;
    }

    function removeStockFromPortfolio(stockName, stockSymbol) {
        var async = $q.defer();

        var activeUser = userSrv.getActiveUser();
        if (activeUser.id) {
            var url = "https://estockdata.herokuapp.com/users/" + activeUser.id;

            for (var i=0; i< activeUser.portfolio.length; i++)
            {
                if (activeUser.portfolio[i]["symbol"] === stockSymbol)
                {
                    activeUser.portfolio.splice(i,1);
                    break;
                }
            }

            $http.put(url, activeUser).then(function (success) {
                userSrv.updateActiveUser().then(function(response1){
                    for (var i = 0; i < stockArr.length; i++) {
                        if (stockArr[i].symbol === stockSymbol) {
                            stockArr.splice(i, 1);
                            break;
                        }
                    }
                    async.resolve(stockArr);
                });
            }, function(err) {
                $log.error(err);
            });
        }
        else {
            //oops, something very wrong here!
            async.reject("user does not have an id!!")
        }

        return async.promise;
    };

    function updateStockInPortfolio(stockName, stockSymbol, infoObj) {
        var async = $q.defer();
        var i = 0;
        for (; i < stockArr.length; i++) {
            if (stockArr[i].symbol === stockSymbol) {
                stockArr[i].cprice = infoObj["currentPrice"];
                stockArr[i].dvolume = infoObj["dayVolume"];
                stockArr[i].dayOpen = infoObj["openPrice"];
                break;
            }
        }

        if (i < stockArr.length)
            async.resolve(stockArr);
        else
            async.reject("stock not found in array");

        return async.promise;

    }

    function addAlertToStock(stockSymbol, alertId) {
        var async = $q.defer();

        var activeUser = userSrv.getActiveUser();
        
        if (activeUser.id) {
            var url = "https://estockdata.herokuapp.com/users/" + activeUser.id;

            for (var i=0; i< activeUser.portfolio.length; i++)
            {
                if (activeUser.portfolio[i]["symbol"] === stockSymbol)
                {
                    activeUser.portfolio[i].alertsArr.push({"alertId":alertId});
                    break;
                }
            }
            $http.put(url, activeUser).then(function (success) {
                userSrv.updateActiveUser().then(function(response1){
                    for (var i = 0; i < stockArr.length; i++) {
                        if (stockArr[i].symbol === stockSymbol) {
                            stockArr[i].alertsArr.push({ "alertId": alertId });
                            async.resolve(stockArr, stockSymbol);
                            break;
                        }
                    }            
                    async.resolve(stockArr, stockSymbol);
                });
            }, function(err) {
                $log.error(err);
            });
        }
        else {
            //oops, something very wrong here!
            async.reject("user does not have an id!!")
        }

        return async.promise;
    }

    function removeAlertFromStock(alertId, symbol) {
        var async = $q.defer();

        var activeUser = userSrv.getActiveUser();
        
        if (activeUser && activeUser.id) {
            var url = "https://estockdata.herokuapp.com/users/" + activeUser.id;

            for (var i=0; i< activeUser.portfolio.length; i++)
            {
                if (activeUser.portfolio[i]["symbol"] === symbol)
                {
                    var index = activeUser.portfolio[i].alertsArr.indexOf(alertId);
                    
                    activeUser.portfolio[i].alertsArr.splice(index, 1);
                    break;
                }
            }
            $http.put(url, activeUser).then(function (success) {
                userSrv.updateActiveUser().then(function(response1){
                    for (var i = 0; i < stockArr.length; i++) {
                        if (stockArr[i].symbol === symbol) {
                            for (var j = 0; j < stockArr[i].alertsArr.length; j++) {
                                if (stockArr[i].alertsArr[j].alertId === alertId) {
                                    stockArr[i].alertsArr.splice(j, 1);
                                    break;
                                }
                            }
                            break;
                        }
                    }           
                    async.resolve(stockArr);
                });
            }, function(err) {
                $log.error(err);
            });
        }
        else {
            //oops, something very wrong here!
            async.reject("user does not have an id!!")
        }

        return async.promise;
    }

    function getStockAlertsArr(symbol) {
        //var async = $.defer();

        var activerUser = userSrv.getActiveUser();

        for(var i=0;i<activerUser.portfolio.length; i++)
        {
            if (activerUser.portfolio[i]["symbol"] === symbol)
            {
                return activerUser.portfolio[i].alertsArr;
            }
        }
    }

    return {
        addAlertToStock: addAlertToStock,
        updateStockInPortfolio: updateStockInPortfolio,
        buildStockPortfolio: buildStockPortfolio,
        addStockToPortfolio: addStockToPortfolio,
        removeStockFromPortfolio: removeStockFromPortfolio,
        removeAlertFromStock: removeAlertFromStock,
        getStockAlertsArr: getStockAlertsArr
    }
})