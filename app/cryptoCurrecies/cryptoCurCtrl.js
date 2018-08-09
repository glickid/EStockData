app.controller('cryptoCurCtrl', function ($scope, $timeout, $location, cryptoCurSrv, userSrv) {

    $scope.dataObj = {};
    $scope.noData = false;
    $scope.information = {};
    var dataPoints = [];


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

    $scope.getDigitalCurrencyInfo  =  function (coin, market)
    {
        // var dataObj = {};
        var text = "";

        cryptoCurSrv.getBtcData( coin, market, "DIGITAL_CURRENCY_DAILY")
        .then( function(response) {
           // console.log(response);
           if (!response.data.hasOwnProperty("Meta Data")) 
                $scope.noData = true;

           $scope.information = response.data["Meta Data"];
           $scope.dataObj = response.data["Time Series (Digital Currency Daily)"];
           text = "" + $scope.information["2. Digital Currency Code"] + " (" +
                       $scope.information["3. Digital Currency Name"] + ") - " + 
                       $scope.information["4. Market Code"] + " (" + 
                       $scope.information["5. Market Name"] + ")";

            loadChart(coin, market, text);
        }, function(err) {
            console.log(err);
        });
    }

   

    function loadChart(coin, market, text) {

        buildDataPoints(market);

        var chart = new CanvasJS.Chart("chartContainer", {
            theme: "light1", // "light1", "light2", "dark1", "dark2"
            animationEnabled: true,
            maintainAspectRatio: false,
            title:{
                text: text   
            },
            axisX: {
                interval: 1,
                intervalType: "day",
                valueFormatString: "DD-MM-YYYY"
            },
            axisY:{
                title: "Price (in " + market + ")",
                valueFormatString: "$####"
            },
            data: [{        
                type: "line",
                markerSize: 12,
                xValueFormatString: "DD-MM-YYYY",
                yValueFormatString: "$###.#",
                dataPoints: dataPoints 
            }]
        });

        // chart.render();

        $timeout(function () { //chart.resize(); 
            chart.render(); console.log("timer") }, 0);
    }


    function buildDataPoints(market) {
        var lastPrice = 0;
        var days = 30;
        var index = 0;
        var date = new Date;
        var strFloat = "";
        var price = 0;
        var obj = {};
        var priceField = "";

        dataPoints.length = 0;

        for (let [key, value] of Object.entries($scope.dataObj)) {
            // for (let [key1, val1] of Object.entries(value)) {
                // console.log(key);
                // console.log(JSON.stringify(value));
                
                // let dateArr = key.split("-");
                // let date = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
                if (market==="USD")
                    priceField = "4b. close (USD)";
                else
                    priceField = "4a. close (" + market + ")";

                date = new Date(key);
                strFloat = (value[priceField]);
                price = parseFloat(parseFloat(strFloat).toFixed(2));

                obj = {"x": date, "y": price,
                            "indexLabel" : (price > lastPrice)? "gain":"loss",
                            "markerType" : (price > lastPrice)? "triangle":"cross",
                            "markerColor" : (price > lastPrice)? "#6B8E23": "tomato" };

                dataPoints.push(obj);
                if (++index === days)
                    break;
                lastPrice = price;
            // }
            // if (index === days)
                    // break;
        }
    }
    // dataPoints = [        
    //     { x: new Date("2016-01-1"), y: 6796.85, indexLabel: "gain", markerType: "triangle",  markerColor: "#6B8E23" },
    //     { x: new Date("2016-01-2"), y: 6922.26, indexLabel: "gain", markerType: "triangle",  markerColor: "#6B8E23" },
    //     { x: new Date("2016-01-3") , y: 6793.36, indexLabel: "loss", markerType: "cross", markerColor: "tomato" },
    //     { x: new Date("2016-01-4") , y: 6900.76, indexLabel: "loss", markerType: "cross", markerColor: "tomato" },
    //     { x: new Date("2016-01-5") , y: 6863.00, indexLabel: "gain", markerType: "triangle", markerColor: "#6B8E23" },
    //     { x: new Date("2016-01-6") , y: 7245.35, indexLabel: "gain", markerType: "triangle", markerColor: "#6B8E23" },
    //     { x: new Date("2016-01-7") , y: 7406.51, indexLabel: "loss", markerType: "cross", markerColor: "tomato" },
    //     { x: new Date("2016-01-8") , y: 7421.25, indexLabel: "loss", markerType: "cross", markerColor: "tomato" },
    //     { x: new Date("2016-01-9") , y: 7560.85, indexLabel: "gain", markerType: "triangle", markerColor: "#6B8E23" },
    //     { x: new Date("2016-01-10") , y: 7947.84, indexLabel: "loss", markerType: "cross", markerColor: "tomato" },
    //     { x: new Date("2016-01-11") , y: 8010.32, indexLabel: "gain", markerType: "triangle", markerColor: "#6B8E23" },
    //     { x: new Date("2016-01-12") , y: 7775.48, indexLabel: "loss", markerType: "cross", markerColor: "tomato" }
    // ];
    
});