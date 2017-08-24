angular.module('showstories')
.component('login', {
	templateUrl: '../components/auth/login.component.html',
	controller: LoginCtrl
})

function LoginCtrl ($http, $location, $cookies) {
	var ctrl = this;
	$cookies.remove('user')
	ctrl.login = function () {
		ctrl.user = {
			email: ctrl.email,
			password: ctrl.password
		}
		$http({
			url: 'http://localhost:8081/users/', 
			method: 'GET',
			params: {email: ctrl.user.email, password: ctrl.user.password},
			headers: {'Content-Type': 'application/json'}
		})
		.success(function(d){
			if(d.email == ctrl.user.email && d.password == ctrl.user.password){
		        var currentUser = {
		          email: ctrl.user.email,
				  password: ctrl.user.password,
				  professionCategory: d.professionCategory,
				  profession: d.profession
		        }
				$cookies.putObject('user', currentUser)
				$location.path('/')
			}
		})
	}
}