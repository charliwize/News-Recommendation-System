var db = require('../db');

var Post = db.model('userProfile', {
	username: {type: String, required: true},
	email: {type: String, required: true},
	date: {type: Date, required: true, default: Date.now},
	topic: {type: Array, required: false},
	password: {type: String, required: true},
	profession: {type: String},
	professionCategory: {type: Array}
})


var News = db.model('aggregateNews', {
	title: {type: String, required: false},
	author: {type: String, required: false},
	source: {type: String, required: false},	
	content: {type: String, required: true},
	date_published: {type: Date, required: false, default: Date.now},
	lead_image_url: {type: String, required: false},
	domain: {type: String},
	url: {type: String},
	excerpt: {type: String},
	category: {type: Array}
})

var Ratings = db.model('ratedItems', {
	email: {type: String, required: true},
	title: {type: String, required: true},
	url: {type: String},
	lead_image_url: {type: String, required: false},
	rating: {type: Number, required: true},
	similarityWithContent: {type: Number},
	id: {type: String, required: true}
})

module.exports = {
	Post: Post,
	News: News,
	Ratings: Ratings
}