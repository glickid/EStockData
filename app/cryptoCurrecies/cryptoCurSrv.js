app.factory('cryptoCurSrv', function ($http, $q, $log, configSrv) {

    function getBtcData(coin, market, frequency)
    {
        var key = configSrv.getStockInfoApiKey();
        var theUrl = "https://www.alphavantage.co/query?function=" + frequency + 
            "&symbol="+ coin + "&market="+ market +"&apikey=" + key;
        var async = $q.defer();

        $http.get(theUrl).then( function(response) {
            async.resolve(response);
        }, function(err){
            $log.error(err);
            async.reject("failed to get BTC info " + frequency + market );
        })

        return async.promise;
    }

    return {
        getBtcData : getBtcData
    }
});