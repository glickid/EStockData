app.factory('portfolioSrv', function ($http, $q) {

    function Stock(name, symbol, purchasePrice, purchaseDate, CurrentPrice, dayVolume, dayOpen) {
        this.name = name;
        this.symbol = symbol;
        this.pprice = purchasePrice;
        this.pdate = purchaseDate;
        this.cprice = CurrentPrice;
        this.dvolume = dayVolume;
        this.dopen = dayOpen;
        this.dayChange = function () {
            var num = (((this.cprice - this.dopen) / this.dopen) * 100);
            return num.toFixed(2);
        }
        this.overallProfit = function () {
            var num = (((this.cprice - this.pprice) / this.pprice) * 100);
            return num.toFixed(2);
        }
    }

    var stockArr = [];

    function buildStockPortfolio(obj, infoObj) {
        var async = $q.defer();

        var stock = new Stock(obj["Name"], obj["Symbol"], obj["purchasePrice"], obj["purchaseDate"],
            infoObj["currentPrice"], infoObj["dayVolume"], infoObj["openPrice"]);
        stockArr.push(stock);
        //TODO : post stock to user portfolio in DB
        async.resolve(stock);

        return async.promise;
    }

    function calcCurrentDate() {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return "" + year + "-" + month + "-" + day;
    }

    function addStockToPortfolio(stockName, stockSymbol, infoObj) {

        var async = $q.defer();

        var stock = new Stock(stockName, stockSymbol, infoObj["currentPrice"], calcCurrentDate(), infoObj["currentPrice"],
            infoObj["dayVolume"], infoObj["openPrice"]);
        stockArr.push(stock);
        //TODO : post stock to user portfolio in DB
        async.resolve(stock);

        return async.promise;
    }

    function updateStockInPortfolio(stockName, stockSymbol, infoObj) {
        var async = $q.defer();
        var i=0;
        for (; i < stockArr.length; i++) {
            if (stockArr[i].symbol === stockSymbol) {
                stockArr[i].cprice = infoObj["currentPrice"];
                stockArr[i].dvolume = infoObj["dayVolume"];
                stockArr[i].dayOpen = infoObj["openPrice"];
                break;
            }
        }
        //TODO : post stock to user portfolio in DB
        if (i<stockArr.length)
            async.resolve(stockArr[i]);
        else
            async.reject("stock not found in array");

        return async.promise;

    }
    return {
        updateStockInPortfolio : updateStockInPortfolio,
        buildStockPortfolio: buildStockPortfolio,
        addStockToPortfolio: addStockToPortfolio
    }
})