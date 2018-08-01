app.factory('portfolioSrv', function ($http, $q) {

    function Stock (name, symbol, purchasePrice, purchaseDate, CurrentPrice, dayVolume, dayOpen){
        this.name = name;
        this.symbol = symbol; 
        this.pprice = purchasePrice;
        this.pdate = purchaseDate;
        this.cprice = CurrentPrice;
        this.dvolume = dayVolume;
        this.dopen = dayOpen;
        this.dayChange = function(){
            var num = (((this.cprice-this.dopen)/this.dopen)*100);
            return num.toFixed(2);
        }
        this.overallProfit= function(){
           var num = (((this.cprice-this.pprice)/this.pprice)*100);
           return num.toFixed(2);
        }
    }
    
    function buildStockPortfolio(obj, infoObj) {
        var async = $q.defer();

        var stock = new Stock(obj["Name"], obj["Symbol"], obj["purchasePrice"], obj["purchaseDate"],
            infoObj["currentPrice"], infoObj["dayVolume"], infoObj["openPrice"]);
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

    function addStockToPortfolio (stockName, stockSymbol, infoObj) {

        var async = $q.defer();

        var stock = new Stock(stockName, stockSymbol, infoObj["currentPrice"], calcCurrentDate(), infoObj["currentPrice"],
                    infoObj["dayVolume"], infoObj["openPrice"]);
        //TODO : post stock to user portfolio in DB
        async.resolve(stock);

        return async.promise;
    }

    return {
        buildStockPortfolio : buildStockPortfolio,
        addStockToPortfolio : addStockToPortfolio
    }
})