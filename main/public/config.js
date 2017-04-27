var app = angular.module("showstories", ["ngRoute", "ngDialog", "ngSanitize", "ngAnimate", "ui.bootstrap"]);

app.config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider.
    when('/', {
      template: '<home-component></home-component>'
    }).
    when('/story/:id', {
      template: '<news-detail></news-detail>'
    })
    .otherwise({redirectTo: "/"});
	$locationProvider.html5Mode(true);

});