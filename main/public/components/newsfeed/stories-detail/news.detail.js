angular.module('showstories')
.component('newsDetail', {
	templateUrl: 'components/newsfeed/stories-detail/news.detail.html',
	controller: newsDetailController,
	controllerAs: 'newsDetail'

})
function newsDetailController($http, ngDialog, $scope, $routeParams, siteService, $cookies){
	var ctrl = this;
	ctrl.user = $cookies.getObject('user')

	//get current user logged in and save the user's rating value 
	ctrl.currentUser = ctrl.user;
	console.log(ctrl.user)
	ctrl.$onInit = function(){
		$http.get('http://localhost:8081/api/' + $routeParams.id).success(function(data){
			ctrl.categories = [];
			angular.forEach(data.category, function(category){
				if(category.score >= 0.30){
					var items = category.label.split('/')
					angular.forEach(items, function(item){
						ctrl.categories.push(item)
					})
				}
			})
			ctrl.article = data
			$http({
			    url: 'http://localhost:8081/ratedstories/', 
			    method: "GET",
			    params: {email: ctrl.currentUser.email, title: ctrl.article.title},
			    headers : {'Accept' : 'application/json'}
			}).success(function(data){
				ctrl.rate = data.rating;
			});
		})
	}
	ctrl.rate = 0;
  	ctrl.max = 5;
  	ctrl.isReadonly = false;

	ctrl.hoveringOver = function(value) {
    	ctrl.overStar = value
    	ctrl.percent = 100 * (value / ctrl.max);
  	};
  	ctrl.clickOn = function(value){
  		console.log(value, ctrl.currentUser.email, ctrl.article.title, ctrl.article.url)
  		$http({
			url: 'http://localhost:8081/ratedstories/', 
			method: 'PUT',
			data: {
				email: ctrl.currentUser.email,
				title: ctrl.article.title,
				url: ctrl.article.url,
				rating: value
			},
			headers: {'Content-Type': 'application/json'}
		})
  	}

}