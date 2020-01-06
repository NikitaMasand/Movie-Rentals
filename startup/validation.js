const Joi = require('joi');
module.exports = function(){
    Joi.objectId = require('joi-objectid')(Joi); //returns a function. objectId is a method on joi obj
}