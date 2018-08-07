app.controller('chartsCtrl', function ($scope, $location, $routeParams, dataSrv) {

    var dataPoints = [];
    $scope.Title = $routeParams.stockSymbol;
    var period = $routeParams.period;


    $scope.openStockChart = function(symbol, period) {
        $location.path("/charts/"+ symbol +"/" + period );
    }

    loadChart();
    
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
                yValueFormatString: "$##0.00",
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
});