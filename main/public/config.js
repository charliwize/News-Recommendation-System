var app = angular.module("showstories", ["ngRoute", "ngDialog", "ngSanitize", "ngAnimate", "ui.bootstrap", "ngCookies"]);

app.config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider.
    when('/', {
      template: '<home-component></home-component>'
    }).
    when('/story/:id', {
      template: '<news-detail></news-detail>'
    }).
    when('/login', {
      template: '<login></login>'
    }).
    when('/create', {
      template: '<create-account></create-account>'
    })
    .otherwise({redirectTo: "/"});
	$locationProvider.html5Mode(true);

});