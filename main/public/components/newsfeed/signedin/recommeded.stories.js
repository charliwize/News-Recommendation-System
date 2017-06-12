angular.module('showstories')
.component('recommededStories', {
	templateUrl: 'components/newsfeed/signedin/recommeded.stories.html',
	controller: DefaultStories,
	bindings: {
		articles: '='
	}
})

function DefaultStories () {
	var ctrl = this;
	var recommended = ctrl.articles.filter(function(items){
		return items.recommended == true
	})
	if(recommended.length > 0) {
		ctrl.recommended = recommended
	}
	else {
		ctrl.recommended = ctrl.articles
	}
}