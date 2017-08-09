angular.module('showstories')
.component('recommendedStories', {
	templateUrl: 'components/newsfeed/signed-in/recommeded.stories.html',
	controller: RecommendedStories,
	bindings: {
		user: '=',
		config: '='
	}
})

function RecommendedStories (siteService, $http) {
	var getParams = {
		params: "",
		headers: {'Accept' : 'application/json'}
	}
	var ctrl = this;
	ctrl.$onInit = function () {
		collaborativeFiltering()
		contentBasedFiltering()
	}
	/*
		returns users who share common preferences with current user
	*/
	function collaborativeFiltering () {
		var param = new Object
		var userPreferences = new Object()
		siteService.getUser(ctrl.config)
		.then(function(respUser){ 
			userPreferences.topic = respUser.data.topic
			getParams.params = userPreferences
			siteService.getSimilarUser(getParams)
			.then(function(response){
				var similarUsers = response.data.filter(function (similarUser) {
					return similarUser._doc.email !== respUser.data.email
				})
				return similarUsers
			})
			.then(function(nearestNeighbour){
				console.log(nearestNeighbour)
				$http({
					url: 'http://localhost:8081/ratedstories/', 
					method: "GET",
					headers : {'Accept' : 'application/json'}
				}).success(function(ratedItems){
					var finalARR = []
					for(var i = 0; i < nearestNeighbour.length; i++){
						var nearestNeigboursRating = ratedItems.filter(function(ratedItem) {
							return ratedItem.email === nearestNeighbour[i].email
						})
						for(var x = 0; x < nearestNeigboursRating.length; x++) {
							finalARR.push(nearestNeigboursRating[x])
						}
					}
					function getItemPrediction() {
						// loop through all items and get prediction value using collaborative filetring technique
						// console.log(finalARR)
					}
				});
			})
		})
	}
	/*
		if collaborative filtering returns 0 users then 
		execute "content-based filtering"
	*/
	function contentBasedFiltering () {
		siteService.getNews(ctrl.config)
		.then(function(news){
			siteService.getUser(ctrl.config)
			.then(function(respUser){
				ctrl.respUser = respUser.data
				ctrl.respUser.topic.length > 0 ? topicLengthTrue() : ctrl.articles = news.data 
				function topicLengthTrue () {
					ctrl._dataRestruc = news.data
					var recomdStories = ctrl.respUser.topic
					for(var i in ctrl._dataRestruc) {
						function f () {
							var splittedLabel = ctrl._dataRestruc[i].category[0].label.split('/')
							for(var y in recomdStories) {
								var index = splittedLabel.indexOf(recomdStories[y])
								if(index !== -1){
									ctrl._dataRestruc[i].recommended = true
								}
							}
						}
						(function () {
							if(typeof ctrl._dataRestruc[i].category[0] !== 'undefined') { f() }
						})()
					}
					var filtered_dataRestruc = ctrl._dataRestruc.filter(function(item){
						return item.recommended
					})
					ctrl.articles = filtered_dataRestruc
				}
			})
		})
	}
}