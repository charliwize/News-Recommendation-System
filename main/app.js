var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var fs = require("fs");
var db = require('./db')
var PostProfile = require('./models/userInfoModel')
var MercuryClient = require('mercury-client');
var serveStatic = require('serve-static');
var path = require('path')
var app = express()
var stringSimilarity = require('string-similarity')

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
	// 'https://newsapi.org/v1/articles?source=the-new-york-times&sortBy=top&apiKey=8b92c4aef2e643c3a7ab030a65ff4afe',
	// 'https://newsapi.org/v1/articles?source=entertainment-weekly&sortBy=top&apiKey=8b92c4aef2e643c3a7ab030a65ff4afe',
	// 'https://newsapi.org/v1/articles?source=the-lad-bible&sortBy=top&apiKey=8b92c4aef2e643c3a7ab030a65ff4afe',
	// 'https://newsapi.org/v1/articles?source=national-geographic&sortBy=top&apiKey=8b92c4aef2e643c3a7ab030a65ff4afe',
	// 'https://newsapi.org/v1/articles?source=recode&sortBy=top&apiKey=8b92c4aef2e643c3a7ab030a65ff4afe',
	// 'https://newsapi.org/v1/articles?source=bbc-news&sortBy=top&apiKey=8b92c4aef2e643c3a7ab030a65ff4afe',
	// 'https://newsapi.org/v1/articles?source=the-economist&sortBy=top&apiKey=8b92c4aef2e643c3a7ab030a65ff4afe',
	// 'https://newsapi.org/v1/articles?source=espn&sortBy=top&apiKey=8b92c4aef2e643c3a7ab030a65ff4afe',
	// 'https://newsapi.org/v1/articles?source=cnn&sortBy=top&apiKey=8b92c4aef2e643c3a7ab030a65ff4afe',
	// 'https://newsapi.org/v1/articles?source=al-jazeera-english&sortBy=top&apiKey=8b92c4aef2e643c3a7ab030a65ff4afe',
	// 'https://newsapi.org/v1/articles?source=independent&sortBy=top&apiKey=8b92c4aef2e643c3a7ab030a65ff4afe'
] 
// getStories.makeAPIRequest(api, function(response){
// 	console.log(response)
//     response.articles.forEach(function(item){
//    		if (item.hasOwnProperty('web_url') || item.hasOwnProperty('webUrl'))  {
// 	        item['url'] = item['web_url'] || item['webUrl'];
// 	        delete item['web_url'];
// 	        delete item['webUrl'];
//     	}
//     	mc.parse(item.url)
// 		.then(function(data){
// 			if(data.content !== 'undefined' || data.content !== '' || data.content !== null){
// 				var parameters = {
// 					'html': data.content,
// 					'features': {
// 						'categories': {}
// 					}
// 				}
// 				PostProfile.News.findOne({title: data.title}, function(err, item) {
// 					if(item){
// 						app.get('/newsapi', function(req, res){
// 							mongoose.model('aggregateNews').find(function(err, news){
// 								res.send(news)
// 							})
// 						})
// 					}			  
// 					else{

// 					/*
// 						IBM NLU analyzes aggregated stories
// 					*/
// 						natural_language_understanding.analyze(parameters, function(err, NLUAnalyzed) {
// 							if (err){
// 								console.log('error:', err);
// 							}
// 							else{
// 								/*
// 									Analyzed stories are saved to DB
// 								*/
// 								var newNews = new PostProfile.News({
// 									title: data.title,
// 									author: data.author,
// 									source: response.source,
// 									content: data.content,
// 									date_published: data.date_published,
// 									lead_image_url: data.lead_image_url,
// 									domain: data.domain,
// 									url: data.url,
// 									excerpt: data.excerpt,
// 									category: NLUAnalyzed.categories[0]
// 								})
// 								newNews.save(function(err, post){
// 									if(err){ 
// 										Object.keys(err.errors).forEach(function(key) {
// 											var message = err.errors[key].message;
// 											console.log('Validation error for "%s": %s', key, message);
// 										});
// 									}
// 									else if(post){
// 										// post sucessful
// 									}
// 								})
// 							}
// 						});
// 					} 
// 				});
// 			}
// 		})
// 		.catch(function () {
// 		     console.log("Error: mercury.postlight.com mercury.postlight.com");
// 		});
// 	})
// })

app.get('/newsapi', function(req, res){
	mongoose.model('aggregateNews').find(function(err, news){
		res.send(news)
	})
})
function WatsonAnalyzeProfession(content){
	var parameters = {
		'html': content || "" ,
		'features': {
			'categories': {}
		}
	}
	return new Promise(function(resolve, reject){
		if(parameters.content !== undefined){
			natural_language_understanding.analyze(parameters, function(err, analyzedContent) {
				if (err){
					console.log('error:', err);
				}
				else{
					var a  = analyzedContent.categories[0].label
					resolve(a)
					reject(new Error("not found"))
				}
			})
		}
		else{
			resolve("")
		}
	
	})
}

app.post('/userpref', function(req, res, next){
	if(req){
		Promise.all([WatsonAnalyzeProfession(req.body.profession)])
		.then(function() {
			var userProfessionAnalyzed = data[0].split('/')
			var b = userProfessionAnalyzed.splice(0,1)
			var postProfile = new PostProfile.Post({
				username: req.body.username,
				email: req.body.email,
				topic: req.body.topic,
				profession: req.body.profession,
				professionCategory: userProfessionAnalyzed || ""
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
		})	
	}
})
app.put('/userpref', function(req, res, next){
	if(req){
		Promise.all([WatsonAnalyzeProfession(req.body.profession)])
		.then(function(data){
			var userProfessionAnalyzed = data[0].split('/')			
			var b = userProfessionAnalyzed.splice(0,1)
			PostProfile.Post.findById(req.body._id, function(err, item) {
				if(item){
					item.username = req.body.username || item.username;
					item.email = req.body.email  || item.email;
					item.topic = req.body.topic || item.topic;
					item.profession = req.body.profession || item.profession;
					item.professionCategory = userProfessionAnalyzed || ""
					item.save(function(err, saved){
						if(saved){
							res.send(item);
						}
					})
				}
			}); 
		})
	}
})
//get current user based on email and password
app.get('/users', function(req, res){
	PostProfile.Post.findOne({email: req.query.email, password: req.query.password}, function(err, item) {
		res.send(item)
	})
})
	/*
		handles new user signup functionality and create a new user
	*/
app.post('/users', function(req, res, next){
	if(req){
		var newUser = new PostProfile.Post({
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
		})
		/*
			saves new user information in PostProfile table
		*/
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
/*
User selects their profeerences, 
** handles and saves user preferences in preference table
*/


app.get('/api/:id', function(req, res){
	PostProfile.News.findById(req.params.id, function(err, item){
		res.send(item)
	})
})


app.put('/ratedstories', function(req, res, next){
	var secondArg = new Array(req.body.professionCategory.join())
	secondArg.push(req.body.professionCategory.join())
	var match = stringSimilarity.findBestMatch(req.body.categories.toString(), secondArg)	
	var similarityWithContent = match.bestMatch.rating.toFixed(2)
	PostProfile.Ratings.findOne({email: req.body.email, title: req.body.title}, function(err, item) {
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
					email: req.body.email,
					title: req.body.title,
					url: req.body.url,
					lead_image_url: req.body.lead_image_url,
					rating: req.body.rating,
					similarityWithContent: similarityWithContent
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
				lead_image_url: req.body.lead_image_url,
				rating: req.body.rating,
				similarityWithContent: similarityWithContent,
				id: req.body.id
			})
			postProfile.save()
	    }
	});
}); 

app.get('/ratedstories', function(req, res){
	if(Object.keys(req.query).length > 0){
		PostProfile.Ratings.findOne({email: req.query.email, title: req.query.title}, function(err, item) {
			res.send(item)
		})
	}
	else {
		mongoose.model('ratedItems').find(function(err, ratedItems){
			res.send(ratedItems)
		})
	}
})
app.get('/similarusers', function(req, res){
	if(typeof req.query.topic !== 'undefined') {
		var _usrTopics = req.query.topic || undefined
		var similarUsers = []
		var nearestNeighbors = []
		mongoose.model('userProfile').find(function(err, users){
			if(err){
				console.log(err)
			}
			try {
				var NONEmptyTopicUsers = users.filter(function(user) {
					return user.topic.length > 0
				})
			} catch (error) {
				console.log("error here")
			}
			// loop through current users with non empty topic and filtered users, 
			// then find if any match is found
			// refactor
			if(typeof _usrTopics === 'object'){
				for(var i = 0; i < NONEmptyTopicUsers.length; i++){
					for(var x = 0; x < _usrTopics.length; x++){
						if(NONEmptyTopicUsers[i].topic.indexOf(_usrTopics[x]) !== -1){
							similarUsers.push(NONEmptyTopicUsers[i])
							break
						}
					}
				}
			}
			else {
				for(var i = 0; i < NONEmptyTopicUsers.length; i++){
					if(NONEmptyTopicUsers[i].topic.indexOf(_usrTopics) !== -1){
						similarUsers.push(NONEmptyTopicUsers[i])
					}
				}
			}
			(function findNearestNeighbors(){
				for(var sim_= 0; sim_ < similarUsers.length; sim_++){
					var target = []
					target.push(similarUsers[sim_].topic.join())
					similarUsers[sim_].similarity = ""
					var copy = Object.assign({}, similarUsers[sim_]);
					// find similarity between users
					var match = stringSimilarity.findBestMatch(_usrTopics.toString(), target)
					// check if similarity passes threshold of 0.5
					if(match.ratings[0].rating > 0.5) {
						copy.similarity = match.ratings[0].rating
						nearestNeighbors.push(copy)
					}
				}
			})()				
			// console.log(nearestNeighbors)
			res.send(JSON.stringify(nearestNeighbors))
		})
	}
})

