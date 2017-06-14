angular.module('showstories')
.component('recommendedStories', {
	templateUrl: 'components/newsfeed/signed-in/recommeded.stories.html',
	controller: RecommendedStories,
	bindings: {
		user: '=',
		config: '='
	}
})

function RecommendedStories (siteService) {
	var ctrl = this;
	siteService.getNews(ctrl.config)
	.then(function(news){
		siteService.getUser(ctrl.config)
		.then(function(respUser){
			ctrl.respUser = respUser.data
			if(ctrl.respUser.topic.length > 0){
				ctrl._dataRestruc = news.data
				var recomdStories = ctrl.respUser.topic
				for(var i in ctrl._dataRestruc) {
					if(typeof ctrl._dataRestruc[i].category[0] !== 'undefined') {
						var splittedLabel = ctrl._dataRestruc[i].category[0].label.split('/')
						for(var y in recomdStories) {
							var index = splittedLabel.indexOf(recomdStories[y])
							if(index !== -1){
								ctrl._dataRestruc[i].recommended = true
							}
						}
					}
				}
				var filtered_dataRestruc = ctrl._dataRestruc.filter(function(item){
					return item.recommended
				})
				ctrl.articles = filtered_dataRestruc
			}
			else { ctrl.articles = news.data }
		})
	})
}