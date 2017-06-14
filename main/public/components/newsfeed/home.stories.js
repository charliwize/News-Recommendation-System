angular.module('showstories')
.component('homeComponent', {
	templateUrl: 'components/newsfeed/home.stories.html',
	controller: HomeStories
})

function HomeStories ($http, ngDialog, $scope, $cookies, siteService) {
	var ctrl = this
	ctrl.userAvailable = false
	
}
