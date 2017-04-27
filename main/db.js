mongoose = require('mongoose')
var db = mongoose.connect('mongodb://localhost/newsRecomd')
mongoose.connection.once('connected', function() {
	console.log("Connected to database")
});
module.exports = mongoose