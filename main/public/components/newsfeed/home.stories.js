angular.module('showstories')
.component('homeComponent', {
	templateUrl: 'components/newsfeed/home.stories.html',
	controller: HomeStories
})
function HomeStories ($http, ngDialog, $scope, $cookies) {
	var ctrl = this;
	ctrl.user = false
	$scope.userTopic = [];
	$scope.user = $cookies.getObject('user')
	if(typeof $scope.user !== 'undefined') {
		$http({
		    url: 'http://localhost:8081/users', 
		    method: "GET",
		    params: {email: $scope.user.email, password: $scope.user.password},
		    headers : {'Accept' : 'application/json'}
		})
		.success(function(user){
			$scope.user = user

		})
	}
	
	$http.get('http://localhost:8081/newsapi').success(function(data){
		console.log(data)
		if(typeof $scope.user !== 'undefined') {
			if($scope.user.topic.length > 0){
				var _dataRestruc = data
				var recomdStories = $scope.user.topic
				for(var i in data) {
					_dataRestruc[i].category = data[i].category[0].label.split('/')
					for( var y in recomdStories) {
						var index = _dataRestruc[i].category.indexOf(recomdStories[y])
						if(index !== -1){
							_dataRestruc[i].recommended = true
						}
					}
				}
				ctrl.user = true
				ctrl.articles = _dataRestruc
			}
			else { ctrl.articles = data }
		}
		else{ ctrl.articles = data }
	})
	ctrl.openPreferenceModal = function () {
        ngDialog.open(
        	{
        		scope: $scope,
        		template: 'components/preference.modal.html', 
        		controller: ['$scope', function($scope) {
        			$http.get('topic.json').success(function(data){
        				$scope.preferenceLists = data.topic
        				$scope.submitPreferences = submitPreferences
        				$scope.userProfession = data.profession
						if($scope.user.topic) {
							$scope.userTopics = $scope.user.topic
						}
						else {
							$scope.userTopics = []
						}
    					$scope.addItem = function(item) {
							var index = $scope.userTopics.indexOf(item)
							if (index > -1) {
							    $scope.userTopics.splice(index, 1)
							}
							else{
								$scope.clickedClass = true;
								$scope.userTopics.push(item)
							}
						}
					})

					function submitPreferences(){
						if($scope.user !== ""){
							$scope.user.profession = $scope.userProfession;
														console.log($scope.userTopics)

							$scope.user.topic = $scope.userTopics
			    			$http({
						    	url: 'http://localhost:8081/userpref/', 
						    	method: 'PUT',
						    	data: $scope.user,
						    	headers: {'Content-Type': 'application/json'}
							})
							.success(function(d){
								console.log(d)
							})
			    		}
			    		else{
			    			$scope.user.profession = $scope.userProfession
	    					$http({
				   				url: 'http://localhost:8081/userpref/', 
				   				method: 'POST',
				   				data: $scope.user,
				   				headers: {'Content-Type': 'application/json'}
							})
							.success(function(d){
								console.log(d)
							})
			    		}
				    }
    			}],
        		className: 'ngdialog-theme-default' 
        	}
        );
    };
}

