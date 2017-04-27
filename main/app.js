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
app.listen(3002, function(){
	console.log("started...", 3002)
})
app.use(bodyParser.json({type: 'application/*+json'}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var mc = new MercuryClient('6QuS6lTQWpbFN4bqVDpuHOzyUmI1zNghF4K5Rqmb');

const getStories = require('./get_stories')
const natural_language_understanding = require('./watson-request/watson-request.js')
console.log(natural_language_understanding)
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
var item = []

 
getStories.makeAPIRequest('https://content.guardianapis.com/search?page-size=3&api-key=4fdb8f1f-0206-4dd8-909d-339f8fd8c06a', function(response){
    var obj =  {
	    article: []
	}
    response.forEach(function(getUrl){
    	mc.parse(getUrl.webUrl)
		.then(function(data){
			obj.article.push(data)
			// json = JSON.stringify(obj, null, 10);
			var parameters = {
				'html': data.content,
			  	'features': {
				    	'categories': {}
				  	}
			}
			// fs.writeFile('/public/json.json', json, 'utf8', function(){})
			

			PostProfile.News.findOne({title: data.title}, function(err, item) {
				if(item){
					app.get('/api', function(req, res){
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
								category: response
					    	})

							newNews.save(function(err, post){
					    		if(err){ 
									Object.keys(err.errors).forEach(function(key) {
										var message = err.errors[key].message;
										console.log('Validation error for "%s": %s', key, message);
									});
								}
								else if(post){
									app.get('/api', function(req, res){
										mongoose.model('aggregateNews').find(function(err, news){
											res.send(news)
										})
									})
								}
					    	})
					    }
					});
				} 
			}); 
		})
	})
})



app.post('/userpref', function(req, res, next){
	if(req){
		var postProfile = new PostProfile.Post({
			username: req.body.username,
			email: req.body.email,
			topic: req.body.taxanomy,
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
				console.log("posted")
				res.json(201, post)
			}
			
		})
	}
	
})
app.get('/users', function(req, res){
	mongoose.model('userProfile').find(function(err, users){
		res.send(users)
	})
})


app.put('/userpref', function(req, res, next){
	if(req){
		PostProfile.Post.findById(req.body.id, function(err, item) {
		    if(item){
		    	item.username = req.body.username || item.username;
		        item.email = req.body.email  || item.email;
		        item.topic = req.body.taxanomy || item.topic;
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
	PostProfile.Ratings.findOne({username: req.body.username}, function(err, item) {
		if(item){
			if(item.title == req.body.title){
							console.log(item)

	        	item.rating =  req.body.rating;
	        	item.save(function(err, saved){
	        	if(saved){
	        		res.send(item);
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
	    }
	});
}); 
