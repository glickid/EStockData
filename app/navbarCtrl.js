app.controller("navbarCtrl", function ($scope, userSrv, portfolioSrv, alertsSrv, $interval, $location) {
    var activeUser = null;

    $scope.isUserLoggedIn = function () {
        return userSrv.isLoggedIn();
    }

    $scope.logout = function () {
        userSrv.logout();
        $location.path("/");
    }

    $interval(function () {
        if (userSrv.isLoggedIn()) {
            activeUser = userSrv.getActiveUser();
            alertsSrv.getNumOfAlertsforUser(activeUser.id).then(function (response) {
                $scope.alertNum = response;
            }, function (err) {
                console.log(err);
            })
        }
        else {
            $scope.alertNum = 0;
        }
    }, 4000);

    $scope.userManageAlertsArr = [];

    $scope.getUserAlertsInfo = function () {
        activeUser = userSrv.getActiveUser();
        $scope.userManageAlertsArr.length = 0;
        
        if (activeUser !== null) {
            // for (var j = 0; j < activeUser.portfolio.length; j++) {
                // var userAlertsArr = activeUser.portfolio[j]["alertsArr"].slice();
                alertsSrv.getAlertsforUser(activeUser["id"]).then(function(response) {
                // for (var i = 0; i < userAlertsArr.length; i++) {
                    // alertsSrv.getAlertInfo(userAlertsArr[i]["alertId"]).then(function (response) {
                        for(var i=0; i< response.length; i++)
                        {
                            $scope.userManageAlertsArr.push(response[i]);
                        }
                    }, function (err) {
                        console.log("failed to get alert info");
                    });
                // }
            // }
        }
    }

    $scope.resetAlertsModal = function () {
        $scope.userManageAlertsArr.length = 0;
    }

    $scope.removeAlert = function (alert) {
        alertsSrv.removeAlert(alert["id"]).then(function (response) {
            portfolioSrv.removeAlertFromStock(alert["id"], alert["stockSymbol"]).then(function (response1) {
                var index = $scope.userManageAlertsArr.indexOf(alert);
                $scope.userManageAlertsArr.splice(index, 1);
                if ($scope.userManageAlertsArr.length === 0) {
                    $('#alertsModal').modal('hide');
                    $scope.resetAlertsModal();
                }
            }, function (err) {
                console.log(err)
            })
        }, function (err) {
            console.log(err);
        });
    }
});