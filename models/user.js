const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : 3,
        maxlength : 50
    },
    email : {
        type : String,
        required : true,
        unique : true, 
        minlength : 5,
        maxlength : 255
    },
    
    password : {
        type : String,
        required : true,
        minlength : 5,
        maxlength : 1024 //storing them as hash
    },

    isAdmin : Boolean
});

//adding a method in userSchema
//userSchema.methods returns an object, we can add additional key value pairs to this object
//generateAuth is key and function is value

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id:this._id, isAdmin:this.isAdmin },config.get('jwtPrivateKey'));
    return token;
}


const User = mongoose.model('User',userSchema);

function validateUser(user){
    const schema = {
        name : Joi.string().required().min(3).max(50),
        email : Joi.string().min(5).max(255).required().email(),
        password : Joi.string().min(5).max(255).required()
    }
    return Joi.validate(user,schema);
}
/*
can also use joi password complexity package, it has these by default:
{
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
}
*/

module.exports.User = User;
module.exports.validate = validateUser