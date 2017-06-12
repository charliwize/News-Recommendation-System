var db = require('../db');

var Post = db.model('userProfile', {
	username: {type: String, required: true},
	email: {type: String, required: true},
	date: {type: Date, required: true, default: Date.now},
	topic: {type: Array, required: false},
	password: {type: String, required: true},
	profession: {type: String}
})


var News = db.model('aggregateNews', {
	title: {type: String, required: true},
	content: {type: String, required: true},
	date_published: {type: Date, required: true, default: Date.now},
	lead_image_url: {type: String, required: true},
	domain: {type: String},
	url: {type: String},
	excerpt: {type: String},
	category: {type: Array}
})

var Ratings = db.model('ratedItems', {
	username: {type: String, required: true},
	email: {type: String, required: true},
	title: {type: String, required: true},
	url: {type: String},
	rating: {type: Number, required: true},
})

module.exports = {
	Post: Post,
	News: News,
	Ratings: Ratings
}