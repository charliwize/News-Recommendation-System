var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
	'url': 'https://gateway.watsonplatform.net/natural-language-understanding/api',
  	'username': '3d5b9d4b-b1ee-4414-9f84-8687b50ac398',
  	'password': 'nBmyYoLN3qaV',
  	'version_date': '2017-02-27'
});

module.exports = natural_language_understanding;