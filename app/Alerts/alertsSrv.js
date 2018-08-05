app.factory('alertsSrv', function ($http, $q, $interval, dataSrv) {

    function Alert(userId, alertType, stockSymbol, price) {
        this.id = 1; //todo: get id from server
        this.userId = userId;
        this.alertType = alertType;
        this.stockSymbol = stockSymbol;
        this.price = price;
        this.triggered = false;
    }
    var alertsArr = [];

    $interval( function(){
        var emptyName = "";
        for(var i=0; i<alertsArr.length;i++){
            if (alertsArr[i].triggered)
                continue;

            dataSrv.getStockInfo(emptyName, alertsArr[i].stockSymbol, alertsArr[i] )
            .then (function(response){
                var obj = response["returnedParam"];
                switch (obj.alertType)
                {
                    case "take-profit":
                        if (response["currentPrice"] >= obj.price) {
                           //todo: sendMailToUser(obj.userId);
                            obj.triggered = true;
                            //todo: update DB 
                        }
                        break;
                    case "stop-loss":
                        if (response["currentPrice"] <= obj.price) {
                           //todo: sendMailToUser(obj.userId);
                            obj.triggered = true;
                            //todo: update DB
                        }
                        break;  
                }
            }, function(err){
                $log.log(err);
            })
        }
    }, 30000);

    function loadAlerts() {
        var async = $q.defer();

        if (alertsArr.length > 0) {
            async.resolve(alertsArr);
        }
        else {
            //var loginURL = "app/db.json/users?email=" + email + "&password=" + password;
            var loginURL = "app/db.json";
            $http.get(loginURL).then(function (response) {

                for (var i = 0; i < response.data.alerts.length; i++) {

                    var alert = new Alert(//response.data.alerts[i]["id"],
                        response.data.alerts[i]["userId"],
                        response.data.alerts[i]["alertType"],
                        response.data.alerts[i]["stockSymbol"],
                        response.data.alerts[i]["price"]);
                    alertsArr.push(alert);
                    async.resolve(alertsArr);
                    break;
                }
            }, function (err) {
                async.reject(err);
            });
        }
        return async.promise;
    }

    function setNewAlert(userId, alertType, stockSymbol, price) {
        var async = $q.defer();
        var alert = new Alert(userId, alertType, stockSymbol, price);

        alertsArr.push(alert);

        //todo: update DB

        async.resolve(alert);

        return async.promise;
    }

    function getNumOfAlertsforUser(userId)
    {
        var num = 0;

        for (var i=0; i<alertsArr.length; i++)
        {
            if (alertsArr[i].userId === userId)
            {
                num++;
            }
        }

        return num;
    }



    return {
        setNewAlert : setNewAlert,
        loadAlerts : loadAlerts,
        getNumOfAlertsforUser : getNumOfAlertsforUser
    }
})
