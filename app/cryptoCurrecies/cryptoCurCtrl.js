app.controller('cryptoCurCtrl', function ($scope, $timeout, $location, $window, cryptoCurSrv, userSrv) {

    $scope.dataObj = {};
    $scope.noData = false;
    $scope.information = {};
    var dataPoints = [];
    $scope.errorMessage = "";
    $scope.graphType = "";
    $scope.dataErrorMessage = "";

    var activerUser = userSrv.getActiveUser();

    if (activerUser === null) {
        $location.path("/");
    }

    $scope.informationSize = function () {
        if (Object.keys($scope.information).length === 0)
            return false;
        else
            return true;
    }

    $scope.getDigitalCurrencyInfo = function (coin, market) {
        // var dataObj = {};
        var text = "";
        if ($scope.graphType === "") {
            $scope.errorMessage = "Please, select graph Type";
            return;
        }
        $scope.errorMessage = "";

        cryptoCurSrv.getBtcData(coin, market, $scope.graphType)
            .then(function (response) {
                // console.log(response);
                if (!response.data.hasOwnProperty("Meta Data")) {
                    $scope.noData = true;
                    $scope.dataErrorMessage = "Sorry Server return empty message";
                    $scope.dataObj = {};
                    return;
                }
                $scope.noData = false;
                $scope.dataErrorMessage = "";
                $scope.information = response.data["Meta Data"];

                if ($scope.graphType === "DIGITAL_CURRENCY_DAILY")
                    $scope.dataObj = response.data["Time Series (Digital Currency Daily)"];
                else if ($scope.graphType === "DIGITAL_CURRENCY_WEEKLY")
                    $scope.dataObj = response.data["Time Series (Digital Currency Weekly)"];
                else if ($scope.graphType === "DIGITAL_CURRENCY_MONTHLY")
                    $scope.dataObj = response.data["Time Series (Digital Currency Monthly)"];

                text = "" + $scope.information["2. Digital Currency Code"] + " (" +
                    $scope.information["3. Digital Currency Name"] + ") - " +
                    $scope.information["4. Market Code"] + " (" +
                    $scope.information["5. Market Name"] + ")";

                loadChart(coin, market, text);
            }, function (err) {
                console.log(err);
            });
    }

    function loadChart(coin, market, text) {
        var interval = "";

        buildDataPoints(market);


        if ($scope.graphType === "DIGITAL_CURRENCY_DAILY")
            interval = "day";
        else if ($scope.graphType === "DIGITAL_CURRENCY_WEEKLY")
            interval = "week";
        else if ($scope.graphType === "DIGITAL_CURRENCY_MONTHLY")
            interval = "month";

        var chart = new CanvasJS.Chart("chartContainer", {
            theme: "light1", // "light1", "light2", "dark1", "dark2"
            animationEnabled: true,
            maintainAspectRatio: false,
            title: {
                text: text
            },
            axisX: {
                interval: 1,
                intervalType: interval,
                valueFormatString: "DD-MM-YYYY"
            },
            axisY: {
                title: "Price (in " + market + ")",
                valueFormatString: "####"
            },
            data: [{
                type: "line",
                markerSize: 12,
                xValueFormatString: "DD-MM-YYYY",
                yValueFormatString: "###.#",
                dataPoints: dataPoints
            }]
        });

        // chart.render();
        // needed to solve problem with chart appearence 
        $timeout(function () {
            //chart.resize(); 
            chart.render();
        }, 0);
    }


    function buildDataPoints(market) {
        //var lastPrice = 0;
        var days = 0;
        var index = 0;
        var date = new Date;
        var strFloat = "";
        var price = 0;
        var obj = {};
        var priceField = "";
        var w = angular.element($window);

        dataPoints.length = 0;

        if ($scope.graphType === "DIGITAL_CURRENCY_DAILY")
            days = 45;
        else if ($scope.graphType === "DIGITAL_CURRENCY_WEEKLY")
            days = 45;
        else if ($scope.graphType === "DIGITAL_CURRENCY_MONTHLY")
            days = 36;

        if (w.width() < 600)
            days = Math.round(days / 3);
        else if (w.width < 769)
            days = Math.round(days / 2);

        for (let [key, value] of Object.entries($scope.dataObj)) {
            if (market === "USD")
                priceField = "4b. close (USD)";
            else
                priceField = "4a. close (" + market + ")";

            date = new Date(key);
            strFloat = (value[priceField]);
            price = parseFloat(parseFloat(strFloat).toFixed(2));

            obj = { "x": date, "y": price };

            dataPoints.push(obj);
            if (++index === days)
                break;
            // lastPrice = price;
        }

        for (var i = dataPoints.length - 1; i > 0; i--) {
            if (dataPoints[i]["y"] < dataPoints[i - 1]["y"]) {
                dataPoints[i - 1]["indexLabel"] = "gain";
                dataPoints[i - 1]["markerType"] = "triangle";
                dataPoints[i - 1]["markerColor"] = "#6B8E23";
            } else {
                dataPoints[i - 1]["indexLabel"] = "loss";
                dataPoints[i - 1]["markerType"] = "cross";
                dataPoints[i - 1]["markerColor"] = "tomato";
            }
        }
    }
});