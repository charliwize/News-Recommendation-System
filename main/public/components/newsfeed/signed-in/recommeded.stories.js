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
				// console.log(nearestNeighbour)
				
				var summedSimilarity = 0
				for(var x = 0; x < nearestNeighbour.length; x++){
					summedSimilarity += nearestNeighbour[x].similarity
				}
				summedSimilarity = summedSimilarity.toFixed(2)
				$http({
					url: 'http://localhost:8081/ratedstories/', 
					method: "GET",
					headers : {'Accept' : 'application/json'}
				})
				.success(function(ratedItems){
					var neighboursRatedItems = []
					for(var i = 0; i < nearestNeighbour.length; i++){
						
						var nearestNeigboursRatedItems = ratedItems.filter(function(ratedItem) {
							return ratedItem.email === nearestNeighbour[i]._doc.email							
						})
						/**
						 * finalArr list contains all nearest neighbours for current user
						 */
						for(var x = 0; x < nearestNeigboursRatedItems.length; x++) {
							neighboursRatedItems.push(nearestNeigboursRatedItems[x])
						}
					}
					// loop through all items and get prediction value using collaborative filtering technique
					function getItemPrediction() {
						for (var i = 0; i < neighboursRatedItems.length; i++){
							nearestNeighbour.forEach(function(element) {
								if(element._doc.email == neighboursRatedItems[i].email){
									neighboursRatedItems[i].similarity = element.similarity.toFixed(2)
								}
							}, this);
						}
						
						
						// console.log(Rv_i);
						//error : Rv_i returns two results from 2 rated items
						// : closure
						(function eachPrediction() {
							var Esum = 0
							var userBasedF = []
							ctrl.recommendedItems = []
							var finalObj = {
								predictionValue: null,
								story: null
							}
							neighboursRatedItems.forEach(function(element) {
								var clonedObj = Object.create(finalObj)
								if(typeof element.similarity !== 'undefined'){
									
									Esum = element.rating * element.similarity
									// ...normalize the sum of the product of ratings and similarities
									var similaritiesRatingsSum = ((Esum - 0) / (5-0)).toFixed(2);
									var predictions = (similaritiesRatingsSum / summedSimilarity).toFixed(2)
									clonedObj.predictionValue = predictions
									clonedObj.story = element
									
									// similarityWithContent
									userBasedF.push(clonedObj)
								}
							}, this);
							for(var i = 0; i < userBasedF.length; i++){
								
								// check nearest neighbour similarity with content and add/remove PSV value
								if(userBasedF[i].story.similarityWithContent > 0.5 && userBasedF[i].story.rating > 2){
									userBasedF[i].predictionValue = userBasedF[i].predictionValue + 0.25
								}
								else if (userBasedF[i].story.similarityWithContent > 0.5 && userBasedF[i].story.rating < 3){
									userBasedF[i].predictionValue = userBasedF[i].predictionValue - 0.25
								}
								if(userBasedF[i].predictionValue > 0.5) {
									ctrl.recommendedItems.push(userBasedF[i])
								}
							}
						})()
					}
					getItemPrediction()
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