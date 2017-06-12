angular.module('showstories')
.component('defaultStories', {
	templateUrl: 'components/newsfeed/signedout/default.stories.html',
	controller: DefaultStories,
	bindings: {
		articles: '='
	}
})

function DefaultStories () {
	var ctrl = this;
}