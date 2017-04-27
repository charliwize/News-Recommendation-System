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
		console.log("data")
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
    					$scope.addItem = function(item) {
							var index = $scope.selectedTopic.taxanomy.indexOf(item)
							if (index > -1) {
							    $scope.selectedTopic.taxanomy.splice(index, 1)
							}
							else{
								$scope.clickedClass = true;
								$scope.selectedTopic.taxanomy.push(item)
							}
						}
	        			$http.get('http://localhost:3002/users').success(function(data){
	        				angular.forEach(data, function(userItems){
	        					if(userItems.email == $scope.selectedTopic.email){
	        						if(userItems.topic !== undefined){
	        							$scope.userTopic = userItems.topic.split(",")
	        							angular.forEach($scope.userTopic, function(existingTopic){
	        								$scope.selectedTopic.id = userItems._id;
	        								$scope.selectedTopic.profession = $scope.userProfession;
	        								$scope.selectedTopic.taxanomy.push(existingTopic);
	        							})
	        						}
	        					}
	        					else{
	        						
	        					}
	        				})
	        			})
					})

					function submitPreferences(){
				    	$http.get('http://localhost:3002/users').success(function(data){
				    		var filterExisting = data.filter(function(userItems){
				    			return userItems.email == $scope.selectedTopic.email
				    		})
							if(filterExisting.length !== 0){
								$scope.selectedTopic.profession = $scope.userProfession
				    			$http({
							    	url: 'http://localhost:3002/userpref/', 
							    	method: 'PUT',
							    	data: $scope.selectedTopic,
							    	headers: {'Content-Type': 'application/json'}
								})
								.success(function(d){
									console.log(d)
								})
				    		}
				    		else{
				    			$scope.selectedTopic.profession = $scope.userProfession
		    					$http({
					   				url: 'http://localhost:3002/userpref/', 
					   				method: 'POST',
					   				data: $scope.selectedTopic,
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

