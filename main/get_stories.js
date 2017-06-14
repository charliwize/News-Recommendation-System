const request = require('request');
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');


module.exports = {
	makeAPIRequest: function(urls, callback){
		urls.forEach(function(url) {
			return request(url, function(error, response, body){
				let result = JSON.parse(body)
				return callback(result.articles)
			})
		})
	}
}