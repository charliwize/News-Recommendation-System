angular.module('showstories')
.component('header', {
	templateUrl: 'components/header/header.html',
	controller: HeaderCtrl,
	bindings: {
		user: '=',
		config: '='
	}
})

function HeaderCtrl($http, $scope, siteService, ngDialog, $cookies) {
	var ctrl = this;
	ctrl.user = $cookies.getObject('user')
	if(typeof ctrl.user !== 'undefined'){
		ctrl.config = {
			params: { email: ctrl.user.email, password: ctrl.user.password },
			headers : {'Accept' : 'application/json'}
		}
	}
	else {
		ctrl.config = {
			headers : {'Accept' : 'application/json'}
		}
	}
	siteService.getUser(ctrl.config)
	.then(function(respUser){
		ctrl.respUser = respUser.data
	})
	ctrl.openPreferenceModal = function () {
		$scope.respUser = ctrl.respUser
        ngDialog.open(
        	{
        		scope: $scope,
        		template: 'components/newsfeed/modals/preference.modal.html', 
        		controller: ['$scope', function($scope) {
        			$http.get('topic.json').success(function(data){
        				$scope.preferenceLists = data.topic
        				$scope.submitPreferences = submitPreferences
        				$scope.userProfession = $scope.respUser.profession
						if($scope.respUser.topic) {
							$scope.userTopics = $scope.respUser.topic
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
							ctrl.user.profession = $scope.userProfession
							$scope.respUser.profession = $scope.userProfession;
							$scope.respUser.topic = $scope.userTopics
			    			$http({
						    	url: 'http://localhost:8081/userpref/', 
						    	method: 'PUT',
						    	data: $scope.respUser,
						    	headers: {'Content-Type': 'application/json'}
							})
							.success(function(d){
								ctrl.user.professionCategory = d.professionCategory
								$cookies.putObject('user', ctrl.user)
							})
			    		}
			    		else{
			    			$scope.respUser.profession = $scope.userProfession
	    					$http({
				   				url: 'http://localhost:8081/userpref/', 
				   				method: 'POST',
				   				data: $scope.respUser,
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
