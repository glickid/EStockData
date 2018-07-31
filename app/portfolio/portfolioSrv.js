app.factory('portfolioSrv', function ($http, $q) {

    function searchStock (searchStr){
        var async = $q.defer();
        var stockList = {};
        //var loginURL = "app/db.json/users?email=" + email + "&password=" + password;
        var loginURL = "app/db.json";
        $http.get(loginURL).then(function (response) {
            var stocksArr = response.data.Stocks;
            var lowerName = "";
            var lowerSym = "";
            var lowerStr = searchStr.toLowerCase();

            for (var i =0; i<stocksArr.length; i++)
            {
                lowerName = stocksArr[i].Name.toLowerCase();
                lowerSym = stocksArr[i].Symbol.toLowerCase();
                
                if (( lowerName.includes(lowerStr)) || 
                    ( lowerSym.includes(lowerStr)))
                {
                    stockList[stocksArr[i].Name] = stocksArr[i].Symbol;
                }
            }
            async.resolve(stockList);
        }, function (err) {
            async.reject(err);
        });

        return async.promise;
    }

    return { 
        searchStock: searchStock
    }
})