app.controller("navbarCtrl", function ($scope, userSrv, portfolioSrv, alertsSrv, $interval, $location) {
    var activeUser = null;
    $scope.alertNum = 0;

    $scope.isUserLoggedIn = function () {
        return userSrv.isLoggedIn();
    }

    $scope.logout = function () {
        userSrv.logout();
        portfolioSrv.logout();
        $location.path("/");
    }

    $interval(function () {
        $scope.alertNum = 0 ;
        if (userSrv.isLoggedIn()) {
            activeUser = userSrv.getActiveUser();

            for (var i=0; i<activeUser.portfolio.length; i++)
            {
                $scope.alertNum +=activeUser.portfolio[i].alertsArr.length;
            }
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

            for (var i=0; i<activeUser.portfolio.length; i++)
            {
                for(var j=0; j<activeUser.portfolio[i].alertsArr.length; j++)
                {

                    alertsSrv.getAlertInfo(activeUser.portfolio[i].alertsArr[j]["alertId"])
                    .then(function (response) {
                        $scope.userManageAlertsArr.push(response);
                     }, function (err) {
                         console.log("failed to get alert info");
                     });
                }
            }
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