app.factory('portfolioSrv', function ($http, $q) {

    function Stock (name, symbol, purchasePrice, CurrentPrice, dayVolume, dayOpen){
        this.name = name;
        this.symbol = symbol; 
        this.pprice = purchasePrice;
        this.cprice = CurrentPrice;
        this.dvolume = dayVolume;
        this.dopen = dayOpen;
        this.dayChange = function(){
            var num = (((this.cprice-this.dopen)/this.dopen)*100);
            return num.toFixed(2) + "%";
        }
        this.overallProfit= function(){
           var num = (((this.cprice-this.pprice)/this.pprice)*100);
           return num.toFixed(2) + "%";
        }
    }
    

    function addStockToPortfolio (stockName, stockSymbol, infoObj) {

        var async = $q.defer();

        var stock = new Stock(stockName, stockSymbol, infoObj["currentPrice"], infoObj["currentPrice"],
                    infoObj["dayVolume"], infoObj["openPrice"]);
        //TODO : post stock to user portfolio in DB
        async.resolve(stock);

        return async.promise;
    }

    return {
        addStockToPortfolio : addStockToPortfolio
    }
})