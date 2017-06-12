angular.module('showstories')
.component('newsDetail', {
	templateUrl: 'components/newsfeed/news.detail.html',
	controller: newsDetailController,
	controllerAs: 'newsDetail'
})

function newsDetailController($http, ngDialog, $scope, $routeParams){
	var ctrl = this;
	//get current user logged in and save the user's rating value 
	ctrl.currentUser = {
		"username": "Victor Nice",
		"email": "victor@gmail.com",
	};

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
			console.log(ctrl.article)
			$http({
			    url: 'http://localhost:8081/ratedstories/', 
			    method: "GET",
			    params: {username: ctrl.currentUser.username, title: ctrl.article.title},
			    headers : {'Accept' : 'application/json'}
			}).success(function(data){
				console.log(data)
				ctrl.rate = data.rating;
			});
		})
		
	}
	ctrl.rate = 0;
  	ctrl.max = 5;
  	ctrl.isReadonly = false;

  	

	

	ctrl.hoveringOver = function(value) {
    	ctrl.overStar = value;
    	ctrl.percent = 100 * (value / ctrl.max);
  	};
  	ctrl.clickOn = function(value){
  		$http({
			url: 'http://localhost:8081/ratedstories/', 
			method: 'PUT',
			data: {
				username: ctrl.currentUser.username,
				email: ctrl.currentUser.email,
				title: ctrl.article.title,
				url: ctrl.article.url,
				rating: value
			},
			headers: {'Content-Type': 'application/json'}
		})
  	}

}