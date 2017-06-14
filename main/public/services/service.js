angular.module('showstories')
.service('siteService', function ($http, $cookies, $q) {	
	return {
		getUser: function(obj){
			return $http.get('http://localhost:8081/users', obj).then(function(respUser){ return respUser })
		},
		getNews: function(obj){
			return $http.get('http://localhost:8081/newsapi', obj).then(function(news){ return news })
		}
	}
})