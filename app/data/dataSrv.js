
app.factory('dataSrv', function ($http, $q, $log, $timeout, $interval, configSrv) {

    var currencyObject = {};
    // var currencyIndex = 0;
    var premises = [];
    var Ndxinfo = {};

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
            else 
            {
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
        var premises = [];
        var async = $q.defer();
        var currArr = configSrv.getCurrencyArr();
        var C1 = currArr[0];
        var C2 = "";

        for (var i = 1; i < currArr.length; i++) {
            C2 = currArr[i];
            premises.push(
                $timeout(getCurrencyValue.bind(null, C1, C2),
                    (30000 + (15000 * (i - 1))))
                // $interval(getCurrencyValue(currArr[0], currArr[i]), //(1150+(1150*i)));
            );
            // $timeout(function(){
            //     $log.log(currArr[i]);
            // }, 2000)
        }

        $q.all(premises).then(function (response) {
            async.resolve(currencyObject);
        }, function (error) {
            $log.log(error);
            async.reject("failed to currency values")
        });

        // //return(premises[premises.length-1].promise);
        return (async.promise);
        return;
    }

    function getNDX() {
        var key = configSrv.getStockInfoApiKey();

        var theUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=NDX&outputsize=compact&apikey=" + key;

        var async = $q.defer();

        // var time = new Date().getSeconds();
        // $log.log(time);

        $http.get(theUrl).then(function (response) {
            $log.log(response);

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

    return {
        getRTperformance: getRTperformance,
        getCurrencies: getCurrencies,
        getCurrencyValue: getCurrencyValue,
        getNDX: getNDX
    }
})