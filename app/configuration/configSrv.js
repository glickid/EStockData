
app.factory('configSrv', function () {
    const stockInfoApiKey = "0ME2BHQ21RW7FMKX";
    const currencyArr = ["USD", "EUR", "GBP", "JPY", "CAD", "HKD"];
    const maxStcokNameLen = 30;


function getStockInfoApiKey () {
    return stockInfoApiKey;
}

function getCurrencyArr() {
    return currencyArr;
}

function getMaxStcokNameLen() {
    return maxStcokNameLen;
}

return {
    getStockInfoApiKey : getStockInfoApiKey,
    getCurrencyArr : getCurrencyArr,
    getMaxStcokNameLen : getMaxStcokNameLen
}

})