const mongoose = require('mongoose');

module.exports = function(){
    
mongoose.connect('mongodb://localhost/movieRentalsdb',{ useNewUrlParser: true, useUnifiedTopology: true } )
.then(()=>console.log('connected to mongo db'))
.catch(err => console.log('error connecting to mongo db ', err));
}