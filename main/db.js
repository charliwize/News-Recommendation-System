mongoose = require('mongoose')
mongoose.Promise = global.Promise;
var db = mongoose.connect('mongodb://localhost/newsRecomd')
mongoose.connection.once('connected', function() {
	console.log("Connected to database")
});
module.exports = mongoose