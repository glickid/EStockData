
app.factory('dataSrv', function ($http, $q, $log, $timeout, $localStorage, configSrv) {

    var currencyObject = {};
    // var currencyIndex = 0;
    var premises = [];
    var Ndxinfo = {};
    var stocksArr = [];
    var gainersArr = [];
    var losersArr = [];

    if (typeof $localStorage.currencyObject !== "undefined") {
        currencyObject = $localStorage.currencyObject;
    }

    if (stocksArr.length === 0) {
        getStockSymboles().then(function (response) {
            //do_nothing
        }, function (err) {
            $log.error(err);
        })
    }
    function getRTperformance() {
        var key = configSrv.getStockInfoApiKey()
        var theUrl = "https://www.alphavantage.co/query?function=SECTOR&apikey=" + key;

        var async = $q.defer();

        $http.get(theUrl).then(function (response) {

            if (response.data.hasOwnProperty("Rank A: Real-Time Performance")) {
                var RTperformance = response.data["Rank A: Real-Time Performance"];
                // var reply = {"updated" : response.data["Meta Data"]["Last Refreshed"],
                var reply = { "data": RTperformance };
                async.resolve(reply);
            }
            else {
                $log.log("failed to parse Currency response ");
                $log.log(response.data);
                async.resolve({});
            }
        }, function (err) {
            $log.error(err);
            async.reject("failed to GET SECTOR info");
        })

        return async.promise;
    }

    function getCurrencyValue(C1, C2) {
        var key = configSrv.getStockInfoApiKey();
        // var currArr = configSrv.getCurrencyArr();
        // currencyIndex++;
        var theUrl = "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=" +
            C1 + "&to_currency=" + C2 + "&apikey=" + key;
        // var theUrl = "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=" + 
        //     currArr[0] + "&to_currency=" + currArr[currencyIndex] + "&apikey=" + key;

        var async = $q.defer();

        var time = new Date().getSeconds();
        $log.log(time);

        $http.get(theUrl).then(function (response) {
            $log.log(response);

            if (response.data.hasOwnProperty("Realtime Currency Exchange Rate")) {
                currencyObject[response.data["Realtime Currency Exchange Rate"]["4. To_Currency Name"]] =
                    response.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
            }
            else {
                $log.log("failed to parse Currency response ");
                $log.log(response.data);
            }
            async.resolve(currencyObject);
        }, function (err) {
            $log.error(err);
            async.reject("failed to get a currency value");
        })

        premises.push(async.promise);
        return async.promise;
    }

    function getCurrencies() {
        var async = $q.defer();
        var currArr = configSrv.getCurrencyArr();
        var C1 = currArr[0];
        var C2 = "";

        for (var i = 1; i < currArr.length; i++) {
            C2 = currArr[i];
            $timeout(getCurrencyValue.bind(null, C1, C2),
                (30000 + (15000 * (i - 1))))
        }

        $q.all(premises).then(function (response) {
            $localStorage.currencyObject = currencyObject;
            async.resolve(currencyObject);
        }, function (error) {
            $log.log(error);
            async.reject("failed to currency values")
        });

        return (async.promise);
    }

    function getNDX() {
        var key = configSrv.getStockInfoApiKey();

        var theUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=NDX&outputsize=compact&apikey=" + key;

        var async = $q.defer();

        // DEBUG:
        // var time = new Date().getSeconds();
        // $log.log(time);

        $http.get(theUrl).then(function (response) {
            // $log.log(response);

            if (response.data.hasOwnProperty("Time Series (Daily)")) {
                Ndxinfo = response.data["Time Series (Daily)"];
            }
            async.resolve(Ndxinfo);
        }, function (err) {
            $log.error(err);
            async.reject("failed to get NDX info");
        })

        premises.push(async.promise);
        return async.promise;
    }

    function getStockInfo(name, symbol, returnedParam) {
        // var key = configSrv.getStockInfoApiKey();
        // var theUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbol + "&outputsize=compact&apikey=" + key;
        var theUrl = "https://api.iextrading.com/1.0/stock/" + symbol + "/chart/1m";
        var async = $q.defer();
        var retObj = {}
        $http.get(theUrl).then(function (response) {
            // $log.log(response);

            // if (response.data.hasOwnProperty("Time Series (Daily)")) {
            // infoObj = response.data["Time Series (Daily)"];
            infoObj = response.data;
            var last = infoObj[Object.keys(infoObj)[Object.keys(infoObj).length - 1]];

            // retObj["currentPrice"] = first["4. close"];
            // retObj["openPrice"] = first["1. open"];
            // retObj["dayVolume"] = first["5. volume"];
            retObj["currentPrice"] = last["close"];
            retObj["openPrice"] = last["open"];
            retObj["dayVolume"] = last["volume"];
            retObj["changePercent"] = last["changePercent"];
            retObj["name"] = name;
            retObj["symbol"] = symbol;
            retObj["returnedParam"] = returnedParam

            // }
            async.resolve(retObj);
        }, function (err) {
            $log.error(err);
            async.reject("failed to get NDX info");
        })

        premises.push(async.promise);
        return async.promise;
    }

    function getStockSymboles() {
        var theUrl = "https://api.iextrading.com/1.0/ref-data/symbols";
        var async = $q.defer();

        $http.get(theUrl).then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].isEnabled === true) {
                    stocksArr.push(response.data[i]);
                }
            }
            async.resolve(stocksArr);
        }, function (err) {
            $log.error(err);
            async.reject("failed to get symbol list");
        });

        return async.promise;
    }

    function getGainersList() {
        var theUrl = "https://api.iextrading.com/1.0/stock/market/list/gainers";
        var async = $q.defer();

        $http.get(theUrl).then(function (response) {
            gainersArr.length = 0;
            gainersArr = response.data.slice(0);
            async.resolve(gainersArr);
        }, function (err) {
            $log.error(err);
            async.reject("failed to get gainers info");
        });

        return async.promise;
    }

    function getLosersList() {
        var theUrl = "https://api.iextrading.com/1.0/stock/market/list/losers";
        var async = $q.defer();

        $http.get(theUrl).then(function (response) {
            losersArr.length = 0;
            losersArr = response.data.slice(0);
            async.resolve(losersArr);
        }, function (err) {
            $log.error(err);
            async.reject("failed to get gainers info");
        });

        return async.promise;
    }

    function searchStock(searchStr) {
        var async = $q.defer();
        var stockList = {};
       
        var lowerName = "";
        var lowerSym = "";
        var lowerStr = searchStr.toLowerCase();

        for (var i = 0; i < stocksArr.length; i++) {
            lowerName = stocksArr[i].name.toLowerCase();
            lowerSym = stocksArr[i].symbol.toLowerCase();

            if ((lowerName.includes(lowerStr)) ||
                (lowerSym.includes(lowerStr))) {
                stockList[stocksArr[i].name] = stocksArr[i].symbol;
            }
        }
        async.resolve(stockList);
        // }, function (err) {
        // async.reject(err);
        // });

        return async.promise;
    }

    function getStockStats(symbol) {
        // var key = configSrv.getStockInfoApiKey();
        var theUrl = "https://api.iextrading.com/1.0//stock/" + symbol + "/stats";
        var async = $q.defer();
        // var retObj = {};

        $http.get(theUrl).then(function (response) {
            async.resolve(response);
        }, function (err) {
            $log.error(err);
            async.reject("failed to get NDX info");
        })

        premises.push(async.promise);
        return async.promise;
    }

    return {
        searchStock: searchStock,
        getStockInfo: getStockInfo,
        getStockStats: getStockStats,
        getRTperformance: getRTperformance,
        getCurrencies: getCurrencies,
        getCurrencyValue: getCurrencyValue,
        getNDX: getNDX,
        getGainersList : getGainersList,
        getLosersList : getLosersList
    }
})