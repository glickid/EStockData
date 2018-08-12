app.controller('chartsCtrl', function ($scope, $location, $routeParams, dataSrv, userSrv) {

    var dataPoints = [];
    $scope.Title = $routeParams.stockSymbol;
    var period = $routeParams.period;

    $scope.openStockChart = function(symbol, period) {
        $location.path("/charts/"+ symbol + "/" + period );
    }

    $scope.goBack = function () {
        window.history.back()
    }

    var activerUser = userSrv.getActiveUser();

    if (activerUser === null) {
         $location.path("/");
    } else { 
        loadChart();
    }
    
    //$scope.loadChart = function () {
    function loadChart() {

        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light1", // "light1", "light2", "dark1", "dark2"
            exportEnabled: true,
            title: {
                text: $scope.Title
            },
            subtitles: [{
                text: "Daily"
            }],
            axisX: {
                interval: 1,
                valueFormatString: "D-MM-YYYY"
            },
            axisY: {
                includeZero: false,
                prefix: "$",
                title: "Price"
            },
            toolTip: {
                content: "Date: {x}<br /><strong>Price:</strong><br />Open: {y[0]}, Close: {y[3]}<br />High: {y[1]}, Low: {y[2]}"
            },
            data: [{
                type: "candlestick",
                yValueFormatString: "$####.##",
                dataPoints: dataPoints
            }]
        });

        // $.get("/app/data/netflix-stock-price.csv", getDataPointsFromCSV);
        setChartInfoForStockPeriod($scope.Title, period);

        function setChartInfoForStockPeriod(stockSymbol, period) {
            dataSrv.getStockChartInfo(stockSymbol, period).then(function (response) {
                // console.log(JSON.stringify(response.data[response.data.length-1]));
                for (var i = 0; i < response.data.length; i++) {
                    
                    dataPoints.push({
                        x: new Date(
                            response.data[i]["date"]
                            // .split("-")[0]),
                            // parseInt(response.data[i]["date"].split("-")[1]),
                            // parseInt(response.data[i]["date"].split("-")[2])
                        ),
                        y: [
                            parseFloat(response.data[i]["open"]),
                            parseFloat(response.data[i]["high"]),
                            parseFloat(response.data[i]["low"]),
                            parseFloat(response.data[i]["close"])
                        ]
                    });
                    // if (i=== response.data.length-1)
                        // console.log(dataPoints[dataPoints.length-1]);
                }

                chart.render();

            }, function (err) {
                console.log(err);
            });
        }
    }

    $scope.stockList = "";

    $scope.searchStock = function (searchStr) {
        if (searchStr.length > 1) {
            dataSrv.searchStock(searchStr).then(function (response) {
                $scope.stockList = response;
            }, function (err) {
                console.log(err);
                $scope.stockList = "";
            })
        }
        else {
            $scope.stockList = "";
        }
    }

    $scope.showChartOfStock = function(name, symbol)
    {
        $location.path("/charts/" + symbol + "/1m");
    }
});