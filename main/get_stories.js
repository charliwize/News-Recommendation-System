const request = require('request');
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');


module.exports = {
	makeAPIRequest: function(url, callback){
		return request(url, function(error, response, body){
			let result = JSON.parse(body)
			return callback(result.response.results)
		})
	}
}