const Joi = require('joi');
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    //defining custom schemas
    //writing the customer schema again and not using directly from the customer model
    //because customer can have like many many properties
    //we don't need all, so taking only the useful ones

    customer : {
        type : new mongoose.Schema({
            name : {
                type : String,
                required : true,
                minlength : 3,
                maxlength : 50
            },
            isPrime : {
                type : Boolean,
                default : false
            },
            phone : {
                type : String,
                required : true,
            }
        }),

        required : true
    },

    movie : {
        type : new mongoose.Schema({
            title : {
                type : String,
                required : true,
                trim : true,
                minlength : 5,
                maxlength : 50
            },
            dailyRentalRate : {
                type : Number, 
                required : true,
                min : 0,
                max : 255
            },

            dateOut : {
                type : Date,
                required : true,
                default : Date.now
            },

            dateReturned : {
                type : Date
            },

            rentalFee : {
                type: Number, 
                min : 0
            }
        }),

        required : true
    }

})

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental){
    const schema = {
        customerId : Joi.objectId().required(),
        movieId : Joi.objectId().required()
    };
    return Joi.validate(rental,schema);

}

module.exports.validate = validateRental;
module.exports.Rental = Rental