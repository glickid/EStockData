app.controller('homeCtrl', function ($scope, $log) {
    var d = new Date();
    
    $scope.updated = (
        ("00" + d.getDate()).slice(-2) + "/" +
        ("00" + (d.getMonth() + 1)).slice(-2) +  " " +
        ("00" + d.getHours()).slice(-2) + ":" + 
        ("00" + d.getMinutes()).slice(-2) + ":" + 
        ("00" + d.getSeconds()).slice(-2));


    // function getRTPerformance ()
    // {
    //     dataSrv.getRTperformance()
    // }
});