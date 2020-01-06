const auth = require('../middleware/auth');
const {Rental , validate } = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');

const mongoose = require('mongoose');
const express = require('express');
const Fawn = require('fawn'); // for transactions that use 2 phase commit internally

const router = express.Router();

Fawn.init(mongoose);

router.get('/',async (req,res) => {
    const rentals = await Rental.find().sort('-dateout');
    res.send(rentals);
})

router.post('/', auth, async (req,res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('invalid customer');

    // if(!mongoose.Types.ObjectId.isValid(req.body.customerId))
    //     return res.status(400).send('invalid customer id ')

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('invalid movie');

    if(movie.numberInStock === 0 ) return res.status(400).send('Movie not in stock! ')

    let rental = new Rental({
        customer : {
            _id : customer._id,
            name : customer.name,
            phone : customer.phone,
            isPrime : customer.isPrime
        },

        movie : {
            _id : movie._id,
            title : movie.title,
            dailyRentalRate : movie.dailyRentalRate
        }
    });

    // rental = await rental.save();
 //it might be a case rental is saved but movie isn't as the server crashes
 //we don't need that. we need to make sure either both these operations complete or they don't :
 // transactions in relational. in mongo: two phase commit
    // movie.numberInStock--;
    // movie.save();

    //working directly with the db
    try {
        new Fawn.Task()
        .save('rentals',rental)
        .update(
            'movies',
            {_id:movie._id},
            {$inc : { numberInStock : -1}}
        )
        .run();
        /*
        ojlinttaskcollections
        when we run this, fawn library creates a collection.
        it runs each task independently here
        and once done, it delete the document from this test db
    
        */
        res.send(rental);
    }
    catch(ex){
        // 500 : internal server error
        res.status(500).send('something failed..')
    }
 



})

module.exports = router;