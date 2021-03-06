app.controller('homeCtrl', function ($scope, $location, dataSrv, $window, userSrv) {
    var d = new Date();
    $scope.currencyObj = {};
    $scope.RTPUpdated = "";
    $scope.RTPObject = {};
    $scope.quantity = 3;
    $scope.NDXinfo = {};

    $scope.updated = (
        ("00" + d.getDate()).slice(-2) + "/" +
        ("00" + (d.getMonth() + 1)).slice(-2) + " " +
        ("00" + d.getHours()).slice(-2) + ":" +
        ("00" + d.getMinutes()).slice(-2) + ":" +
        ("00" + d.getSeconds()).slice(-2));

    getNDXinfo();
    getCurrencies();
    getGainers();
    getLosers();
    getMostActive();

    $scope.isUserLoggedIn = function() {
        return userSrv.isLoggedIn();
    }

    $scope.activerUser = userSrv.getActiveUser();

    function getGainers()
    {
        dataSrv.getGainersList().then(function(response) {
            for(var i=0; i<response.length; i++)
            {
                $scope.gainersList = response;
            }
        }, function(err){
            console.log(err);
        })
    }
    
    function getLosers()
    {
        dataSrv.getLosersList().then(function(response) {
            for(var i=0; i<response.length; i++)
            {
                $scope.losersList = response;
            }
        }, function(err){
            console.log(err);
        })
    }

    function getMostActive() {
        
        dataSrv.getMostActive().then(function(response) {
            for(var i=0; i<response.length; i++)
            {
                $scope.mostActiveList = response;
            }
        }, function(err){
            console.log(err);
        })
    }

    function getCurrency(C1, C2) {
        dataSrv.getCurrencyValue(C1, C2).then(function (reply) {
            $scope.currencyObj = reply;
        }, function (err) {
            console.log(err);
        })
    }

    function getCurrencies() {
        dataSrv.getCurrencies().then(function (reply) {
            $scope.currencyObj = reply;
        }, function (err) {
            console.log(err);
        });
    }

    function getNDXinfo()
    {
        dataSrv.getNDX().then(function(reply){
            $scope.NDXinfo = reply;
            var w = angular.element($window);

            if (w.width() > 1200)
                $scope.quantity = 5;
                
        }, function(err){
            console.log(err)
        })
    }

    $scope.managePortfolio = function()
    {
        $location.path("/portfolio");
        // resetScopeInfo();
    }

    $scope.seeCharts = function ()
    {
        $location.path("/charts/AAPL/1m")
    }

    $scope.seeCryptoCurrencies = function ()
    {
        $location.path("/cryptoCurrency");
    }
});