angular.module('showstories')
.component('createAccount', {
	templateUrl: 'components/auth/createAccount.component.html',
	controller: CreateAccountCtrl
})

function CreateAccountCtrl ($http) {
	var ctrl = this;
	ctrl.create = function () {
		ctrl.user = {
			username: ctrl.username,
			password: ctrl.password,
			email: ctrl.email
		}
		$http({
			url: 'http://localhost:8081/users/', 
			method: 'POST',
			data: ctrl.user,
			headers: {'Content-Type': 'application/json'}
		})
		.success(function(d){
			console.log(d)
		})
		console.log(ctrl.password)
	}
}