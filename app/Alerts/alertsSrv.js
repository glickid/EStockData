app.factory('alertsSrv', function ($http, $q, $log, $interval, dataSrv) {

    function Alert(id, userId, alertType, stockSymbol, price) {
        if (id)
            this.id = id; 
        this.userId = userId;
        this.alertType = alertType;
        this.stockSymbol = stockSymbol;
        this.price = price;
        this.triggered = false;
    }
    var alertsArr = [];

    $interval(function () {
        var emptyName = "";
        for (var i = 0; i < alertsArr.length; i++) {
            if (alertsArr[i].triggered)
                continue;

            dataSrv.getStockInfo(emptyName, alertsArr[i].stockSymbol, alertsArr[i])
                .then(function (response) {
                    var obj = response["returnedParam"];
                    switch (obj.alertType) {
                        case "take-profit":
                            if (response["currentPrice"] >= obj.price) {
                                //todo: sendMailToUser(obj.userId);
                                obj.triggered = true;
                            }
                            break;
                        case "stop-loss":
                            if (response["currentPrice"] <= obj.price) {
                                //todo: sendMailToUser(obj.userId);
                                obj.triggered = true;
                            }
                            break;
                    }
                    //Update the DB
                    if (obj.triggered === true) {
                        var url = "https://estockdata.herokuapp.com/alerts/" + obj.id;
                        $http.put(url, obj)
                            .then(function (success) {
                                //do_nothing
                            }, function (err) {
                                $log.error(err);
                            })
                    }
                }, function (err) {
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
            var loginURL = "https://estockdata.herokuapp.com/alerts";

            $http.get(loginURL).then(function (response) {

                for (var i = 0; i < response.data.length; i++) {

                    var alert = new Alert(response.data[i]["id"],
                        response.data[i]["userId"],
                        response.data[i]["alertType"],
                        response.data[i]["stockSymbol"],
                        response.data[i]["price"]);
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
        var found = false;

        for (var i = 0; i < alertsArr.length; i++) {
            if ((alertsArr[i].stockSymbol === stockSymbol) &&
                (alertsArr[i].userId === userId) &&
                (alertsArr[i].price === price)) {
                found = true;
            }
        }

        if (!found) {
            var alert = new Alert(undefined, userId, alertType, stockSymbol, price);

            //alertsArr.push(alert);

            $http.post("https://estockdata.herokuapp.com/alerts", alert)
                .then(function (success) {
                    alert.id = success.data.id;
                    alertsArr.push(alert);
                    async.resolve(alert);
                }, function (err) {
                    $log.error(err);
                    async.reject("failed to POST alert to server");
                });
        }
        else {
            async.reject("alert already added!");
        }

        return async.promise;
    }

    function getNumOfAlertsforUser(userId) {
        var num = 0;
        var url = "https://estockdata.herokuapp.com/alerts?userID=" + userId;
        var async = $q.defer();

        // for (var i = 0; i < alertsArr.length; i++) {
        //     if (alertsArr[i].userId === userId) {
        //         num++;
        //     }
        // }
        $http.get(url).then(function (response) {
            async.resolve(response.data.length);
        }, function (err) {
            $log.error(err);
            async.reject("failed to get alerts for user" + userId);
        })

        return async.promise;
    }

    function getAlertInfo(alertId) {
        var url="https://estockdata.herokuapp.com/alerts/" + alertId;
        var async = $q.defer();
        // for (var i = 0; i < alertsArr.length; i++) {
        //     if (alertsArr[i].id === alertId) {
        //         return alertsArr[i];
        //     }
        // }

        $http.get(url).then( function(success){
            async.resolve(success.data);
        }, function(err){
            $log.error(err);
            async.reject(null);
        })

        return async.promise;
    }

    function removeAlert(alertId) {
        
        var url="https://estockdata.herokuapp.com/alerts/" + alertId;
        var async = $q.defer();

        $http.delete(url).then(function(success){
            for (var i = 0; i < alertsArr.length; i++) {
                if (alertsArr[i].id === alertId) {
                    alertsArr.splice(i, 1);
                }
            }
            async.resolve({});
        }, function(err){
            async.reject("failed to delete alert id " + alertId);
            $log.error(err);
        });

        return async.promise;
    }

    return {
        setNewAlert: setNewAlert,
        loadAlerts: loadAlerts,
        getNumOfAlertsforUser: getNumOfAlertsforUser,
        getAlertInfo: getAlertInfo,
        removeAlert: removeAlert
    }
})
