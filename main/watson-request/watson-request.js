var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
	'url': 'https://gateway.watsonplatform.net/natural-language-understanding/api',
  	'username': '435a30cf-4656-4a33-ad66-d94204a8032e',
  	'password': 'Str1M2yi3lOV',
  	'version_date': '2017-02-27'
});

module.exports = natural_language_understanding;