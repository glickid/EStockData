
app.factory('configSrv', function () {
    const stockInfoApiKey = "0ME2BHQ21RW7FMKX";
    const currencyArr = ["USD", "EUR", "GBP", "JPY", "CAD", "HKD"];


function getStockInfoApiKey () {
    return stockInfoApiKey;
}

function getCurrencyArr() {
    return currencyArr;
}

return {
    getStockInfoApiKey : getStockInfoApiKey,
    getCurrencyArr : getCurrencyArr
}

})