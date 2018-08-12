var app = angular.module("StockDataApp", ["ngRoute", "ngStorage"]);

app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl : 'home.html',
      controller : 'homeCtrl'
    })
    .when('/signup', {
        templateUrl : 'app/user/signup.html',
        controller : 'userCtrl'
    })
    .when('/portfolio', {
        templateUrl : 'app/portfolio/portfolio.html',
        controller : 'portfolioCtrl'
    })
    .when('/charts/:stockSymbol/:period', {
        templateUrl : 'app/data/charts.html',
        controller : 'chartsCtrl'
    })
    .when('/cryptoCurrency', {
         templateUrl : 'app/cryptoCurrecies/cryptoCur.html',
         controller : 'cryptoCurCtrl'
    })
    .otherwise({redirectTo: '/'
    });
});