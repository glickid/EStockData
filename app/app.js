var app = angular.module("StockDataApp", ["ngRoute", "ngStorage"]);

app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl : 'home.html',
      controller : 'homeCtrl'
    })
    // .when('/login', {
    //     templateUrl : 'App/user/login.html',
    //     controller : 'userCtrl'
    // })
    .when('/signup', {
        templateUrl : 'App/user/signup.html',
        controller : 'userCtrl'
    })
    .when('/portfolio', {
        templateUrl : 'App/portfolio/portfolio.html',
        controller : 'portfolioCtrl'
    })
    // .when('/movies/:movieID', {
    //     templateUrl : 'App/Movies/movieDetails.html',
    //     controller : 'movieDetailsCtrl'
    // })
    .otherwise({redirectTo: '/'
    });
});