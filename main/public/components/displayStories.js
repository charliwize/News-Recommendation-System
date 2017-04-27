angular.module('showstories')
.component('homeComponent', {
	templateUrl: '../templates/homeComponent.html',
	controller: newsItemsController,
	controllerAs: 'homeComponent'
})

function newsItemsController($http, ngDialog, $scope){
	var ctrl = this;
	$scope.userTopic = [];
	$scope.selectedTopic = {
		"username": "Victor Nice",
		"email": "victor@gmail.com",
		"profession": $scope.userProfession,
		"taxanomy": []
	};
	$http.get('http://localhost:3002/api').success(function(data){
	// $http.get('http://localhost:3002/api').success(function(data){
		ctrl.articles = data
		
	})
	ctrl.openPreferenceModal = function () {
        ngDialog.open(
        	{ 
        		scope: $scope,
        		template: '../templates/preferenceModal.html', 
        		controller: ['$scope', function($scope) {
        			$http.get('topic.json').success(function(data){
        				$scope.preferenceLists = data.topic;
        				$scope.submitPreferences = submitPreferences;
	        			$http.get('http://localhost:3002/users').success(function(data){
	        				var prefsArray = data.filter(function(prefArray){
	        					return prefArray.email == $scope.selectedTopic.email
	        				})
	        				if(prefsArray.length){
	        					$scope.user = prefsArray[0];
	        					$scope.userTopics = $scope.user.topic.split(',')
	        				}
	        				
	        			})


    					$scope.addItem = function(item) {
							var index = $scope.userTopics.indexOf(item)
							
							if (index > -1) {
							    $scope.userTopics.splice(index, 1)
							}
							else{
								console.log(item)

								$scope.clickedClass = true;
								$scope.userTopics.push(item)
								console.log($scope.userTopics)
							}
						}
	        		
					})

					function submitPreferences(){
				    	$http.get('http://localhost:3002/users').success(function(data){
				    		var filterExisting = data.filter(function(userItems){
				    			return userItems.email == $scope.user.email
				    		})
							if(filterExisting.length !== 0){
								
								$scope.user.profession = $scope.userProfession;
								$scope.user.topic = $scope.userTopics
								console.log($scope.user)
				    			$http({
							    	url: 'http://localhost:3002/userpref/', 
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
					   				url: 'http://localhost:3002/userpref/', 
					   				method: 'POST',
					   				data: $scope.user,
					   				headers: {'Content-Type': 'application/json'}
								})
								.success(function(d){
									console.log(d)
								})
				    		}
						})
				    }
    			}],
        		className: 'ngdialog-theme-default' 
        	}
        );
    };


	
}

