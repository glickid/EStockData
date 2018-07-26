
app.factory('configSrv', function () {
    const stockInfoApiKey = "0ME2BHQ21RW7FMKX";

function getStockInfoApiKey () {
    return stockInfoApiKey;
}

return {
    getStockInfoApiKey : getStockInfoApiKey
}
})