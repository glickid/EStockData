var app = angular.module("StockDataApp", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl : 'home.html',
      controller : 'homeCtrl'
    })
    .when('/login', {
        templateUrl : 'App/user/login.html',
        controller : 'userCtrl'
    })
    .when('/signin', {
        templateUrl : 'App/user/signin.html',
        controller : 'userCtrl'
    })
    // .when('/movies/:movieID', {
    //     templateUrl : 'App/Movies/movieDetails.html',
    //     controller : 'movieDetailsCtrl'
    // })
    .otherwise({redirectTo: '/'
    });
});