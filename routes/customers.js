const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {customerSchema, validate, Customer} = require('../models/customer') //using object destruction
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer){
        res.status(404).send('customer with given id not found');
    }
    res.send(customer);
});

router.post('/', auth, async(req,res) => {
    const { error } = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    let customer = new Customer({ 
        name : req.body.name,
        phone : req.body.phone,
        isPrime : req.body.isPrime
     }); 
    customer = await customer.save();
    res.send(customer);
});

router.put('/:id', auth, async (req,res) => {
    const { error } = validate(req.body);
    const customer = await Customer.findByIdAndUpdate(req.params.id, 
        {
            name : req.body.name,
            phone : req.body.phone,
            isPrime : req.body.isPrime
         }, 
        { new : true })
    if(!customer){
        res.status(404).send('customer with given id not found');
    }
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    res.send(customer);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id)
    if(!customer){
        res.status(404).send('customer with given id not found');
    }
    res.send(customer);
});


module.exports = router;
