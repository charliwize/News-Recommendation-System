angular.module('showstories')
.component('newsDetail', {
	templateUrl: '../templates/newsDetail.html',
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
	ctrl.rate = 0;
  	ctrl.max = 5;
  	ctrl.isReadonly = false;

  	

	$http.get('http://localhost:3002/api/' + $routeParams.id).success(function(data){
		ctrl.categories = [];
		console.log(data)
		angular.forEach(data.category[0].categories, function(category){
			if(category.score >= 0.45){
				var items = category.label.split('/')
				angular.forEach(items, function(item){
					ctrl.categories.push(item)
				})
			}
		})
		ctrl.article = data
	})

	ctrl.hoveringOver = function(value) {
    	ctrl.overStar = value;
    	ctrl.percent = 100 * (value / ctrl.max);
  	};
  	ctrl.clickOn = function(value){
  		$http({
			url: 'http://localhost:3002/ratedstories/', 
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