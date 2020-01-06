const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
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
});

const Customer = mongoose.model('Customer', customerSchema);
function validateCustomer(customer) {
    const schema = {
        name : Joi.string().min(3).max(50).required(),
        phone : Joi.string().required(),
        isPrime : Joi.boolean()
  };

    return Joi.validate(customer, schema);
}

exports.customerSchema = customerSchema;
exports.validate = validateCustomer;
exports.Customer = Customer;