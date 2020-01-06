const auth = require('../middleware/auth');
const _ = require('lodash'); //by convention _, can use anything
const bcryptjs = require('bcryptjs');
const {User, validate } = require('../models/user');
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();


//401 : client does not have authorization permissions to access this resource

//for registering new users
router.post('/', async(req,res) => {
    const { error } = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne( {email : req.body.email} );
    if(user) res.status(400).send('user already registered!!');

    // user = new User({ 
    //     name : req.body.name,
    //     email : req.body.email,
    //     password : req.body.password
    //  }); 
    user = new User(_.pick(req.body,['name','email','password']));

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(user.password,salt);

    user = await user.save();
    //after registering, user will be logged in

    // const token = jwt.sign({_id:user._id},config.get('jwtPrivateKey'));
    //Information expert principle
    //an object that has enough information and is an expert in its area 
    //that object should be responsible for making decisions and performing tasks
    //because user is who has all the properties to decide that should come in sign

    const token = user.generateAuthToken();
    //then user can retrieve this token from headed and send it to the server next time
    res.header('x-auth-token',token).send(_.pick(user, ['_id', 'name', 'email']));
    //will get a new object with these properties 
});

router.get('/me', auth, async(req,res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
})

module.exports = router;
