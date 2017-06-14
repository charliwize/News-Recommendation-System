angular.module('showstories')
.component('defaultStories', {
	templateUrl: 'components/newsfeed/signed-out/default.stories.html',
	controller: DefaultStories,
	bindings: {
		user: '=',
		config: '='
	}
})

function DefaultStories (siteService) {
	var ctrl = this;
	siteService.getNews(ctrl.config)
	.then(function(news){
		ctrl.articles = news.data
	})
}