const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genre');



const movieSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true,
        minlength : 5,
        maxlength : 50
    },
    genre : {
        type : genreSchema,
        required : true
    },
    numberInStock : {
        type : Number,
        required : true,
        min : 0,
        max : 255
    },
    dailyRentalRate : {
        type : Number, 
        required : true,
        min : 0,
        max : 255
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie){
    const schema = {
        title : Joi.string().min(5).max(50).required(),
        //because client should send only the id of genre
        //mongoose schema can thus grow independent of joi schema
        //joi schema is what the client sends us
        //it's the input to the api
        //in mongoose schema we have representation to the model in our application (persistent model)
        genreId : Joi.objectId().required(),
        numberInStock : Joi.number().min(0).max(255).required(),
        dailyRentalRate : Joi.number().min(0).max(255).required()
    }
    return Joi.validate(movie, schema);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;