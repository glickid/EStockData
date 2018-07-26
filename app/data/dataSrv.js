
app.factory('dataSrv', function($http, $q, $log, configSrv) {


    function getRTperformance () {
        var key = configSrv.getStockInfoApiKey()
        var theUrl = "https://www.alphavantage.co/query?function=SECTOR&apikey=" + key;

        var async = $q.defer();

        $http.get(theUrl).then(function(response){
            var RTperformance = response.data["Rank A: Real-Time Performance"];
            var reply = {"updated" : response.data["Meta Data"]["Last Refreshed"],
                        "Data": RTperformance};
                        async.resolve(reply);
        }, function (err) {
            $log.error(err);
            async.reject("failed to GET SECTOR info");
        })
    
        return async.promise;
    }

    return {
        getRTperformance : getRTperformance
    }
})