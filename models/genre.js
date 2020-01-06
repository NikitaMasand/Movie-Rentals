const mongoose = require('mongoose');
const Joi = require('joi');
const genreSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : 3,
        maxlength : 50
    }
});

// The first argument is the singular name of the collection your model is for. 
// Mongoose automatically looks for the plural, lowercased version of your model name.
// Thus, for the example above, the model Tank is for the tanks collection in the database.
const Genre = mongoose.model('Genre', genreSchema);

// const genres = [
//     {id: 1 , name : 'Action'},
//     {id : 2, name : 'Horror'},
//     {id : 3, name : 'Inspirationals'}
// ];
function validateGenre(genre) {
    const schema = {
        name : Joi.string().min(3).required(),
    };

    return Joi.validate(genre, schema);
}

module.exports.genreSchema = genreSchema;
module.exports.validate = validateGenre;
module.exports.Genre = Genre;