var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require("fs");
var db = require('./db')
var PostProfile = require('./models/userInfoModel')
var MercuryClient = require('mercury-client');
var serveStatic = require('serve-static');
var path = require('path')
var app = express()
app.listen(8081, function(){
	console.log("started...", 8081)
})
app.use(bodyParser.json({type: 'application/*+json'}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var mc = new MercuryClient('6QuS6lTQWpbFN4bqVDpuHOzyUmI1zNghF4K5Rqmb');

const getStories = require('./get_stories')
const natural_language_understanding = require('./watson-request/watson-request.js')
app.use(express.static(__dirname + '/public'))
// app.use("/*", express.static("./public"));
app.get('/', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile(path.join(__dirname + '/public/index.html'))
});

app.get('/story/:id', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile(path.join(__dirname + '/public/index.html'))
});
app.get('/login', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile(path.join(__dirname + '/public/index.html'))
});
app.get('/create', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile(path.join(__dirname + '/public/index.html'))
});
var api = [
	'http://api.nytimes.com/svc/search/v2/articlesearch.json?sort=newest&api-key=a572b583bb1fa33208dd6f68b9e19373:16:75164318',
	'https://content.guardianapis.com/search?page-size=3&api-key=4fdb8f1f-0206-4dd8-909d-339f8fd8c06a'
] 
getStories.makeAPIRequest(api, function(response){
    response.forEach(function(item){
   		if (item.hasOwnProperty('web_url') || item.hasOwnProperty('webUrl'))  {
	        item['url'] = item['web_url'] || item['webUrl'];
	        delete item['web_url'];
	        delete item['webUrl'];
    	}
    	mc.parse(item.url)
		.then(function(data){
			if(data.content !== 'undefined'){
					var parameters = {
					'html': data.content,
				  	'features': {
				    	'categories': {}
			  		}
				}
				PostProfile.News.findOne({title: data.title}, function(err, item) {
					if(item){
						app.get('/newsapi', function(req, res){
							mongoose.model('aggregateNews').find(function(err, news){
								res.send(news)
							})
						})
					}			  
					else{
						natural_language_understanding.analyze(parameters, function(err, response) {
						  	if (err){
						    	console.log('error:', err);
						  	}
						  	else{
						    	var newNews = new PostProfile.News({
						    		title: data.title,
									content: data.content,
									date_published: data.date_published,
									lead_image_url: data.lead_image_url,
									domain: data.domain,
									url: data.url,
									excerpt: data.excerpt,
									category: response.categories[0]
						    	})
								newNews.save(function(err, post){
						    		if(err){ 
										Object.keys(err.errors).forEach(function(key) {
											var message = err.errors[key].message;
											console.log('Validation error for "%s": %s', key, message);
										});
									}
									else if(post){}
						    	})
						    }
						});
					} 
				});
			}
			// json = JSON.stringify(obj, null, 10);
			
			// fs.writeFile('/public/json.json', json, 'utf8', function(){})
		})
	})
})

app.get('/newsapi', function(req, res){
	mongoose.model('aggregateNews').find(function(err, news){
		res.send(news)
	})
})

app.post('/userpref', function(req, res, next){
	if(req){
		var postProfile = new PostProfile.Post({
			username: req.body.username,
			email: req.body.email,
			topic: req.body.topic,
			profession: req.body.profession
		})

		postProfile.save(function(err, post){
			if(err){ 
				Object.keys(err.errors).forEach(function(key) {
				    var message = err.errors[key].message;
				    console.log('Validation error for "%s": %s', key, message);
				  });
				}
			if(post){
				res.json(201, post)
			}
		})
	}
	
})
app.get('/users', function(req, res){
	PostProfile.Post.findOne({email: req.query.email, password: req.query.password}, function(err, item) {
		res.send(item)
	})
})

app.post('/users', function(req, res, next){
	if(req){
		var newUser = new PostProfile.Post({
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
		})

		newUser.save(function(err, post){
			if(err){ 
				Object.keys(err.errors).forEach(function(key) {
				    var message = err.errors[key].message;
				    console.log('Validation error for "%s": %s', key, message);
				  });
				}
			if(post){
				res.json(201, post)
			}
		})
	}
})

app.put('/userpref', function(req, res, next){
	if(req){
		PostProfile.Post.findById(req.body._id, function(err, item) {
		    if(item){
		    	item.username = req.body.username || item.username;
		        item.email = req.body.email  || item.email;
		        item.topic = req.body.topic || item.topic;
		        item.profession = req.body.profession || item.profession;
		        item.save(function(err, saved){
		        	if(saved){
		        		res.send(item);
		        	}
		        })
		    }
		}); 
	}
})

app.get('/api/:id', function(req, res){
	PostProfile.News.findById(req.params.id, function(err, item){
		res.send(item)
	})
})


app.put('/ratedstories', function(req, res, next){
	PostProfile.Ratings.findOne({title: req.body.title}, function(err, item) {
		if(item){
			if(item.email == req.body.email){
	        	item.rating =  req.body.rating;
	        	item.save(function(err, saved){
		        	if(err){
		        		console.log("ERROR", err)
		        	}
	        	})
	    	}
	    	else{
		    	var postProfile = new PostProfile.Ratings({
					username: req.body.username,
					email: req.body.email,
					title: req.body.title,
					url: req.body.url,
					rating: req.body.rating
				})
				postProfile.save()
	    	}
	    	
		}
	    else{
	    	var postProfile = new PostProfile.Ratings({
				username: req.body.username,
				email: req.body.email,
				title: req.body.title,
				url: req.body.url,
				rating: req.body.rating
			})
			postProfile.save()
	    }
	});
}); 

app.get('/ratedstories', function(req, res){
	PostProfile.Ratings.findOne({title: req.query.title}, function(err, item) {
		res.send(item)
	})
})