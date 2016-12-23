var mongoose = require('mongoose');

//setting up mongoose promise to global promise so we can use promises on mongoose
mongoose.Promise = global.Promise;

//no need for callbacks here as mongoose manages it for us any query to db after this line will not be executed behind the scenes unless connection is succesful
//next line will be exectuted but not the query itself
mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = { mongoose };
