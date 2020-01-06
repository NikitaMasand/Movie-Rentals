const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const express = require('express');
const {validate, Movie} = require('../models/movie');
const {Genre} = require('../models/genre')
const router = express.Router();

router.get('/',async(req,res)=>{
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if(!movie){
        res.status(404).send('movie with given id not found');
    }
    res.send(movie);
});

router.put('/:id', auth, async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId)
    if(!genre) return res.status(400).send('invalid genre! ');

    const movie = await Movie.findByIdAndUpdate(req.params.id,
        {
            title : req.body.title,
            genre : {
                _id : genre._id,
                name : genre.name
            },
            numberInStock : parseInt(req.body.numberInStock,10),
            dailyRentalRate : parseInt(req.body.dailyRentalRate,10)
        }, {
            new : true
        })

    if(!movie){
        res.status(404).send('movie with given id not found');
    }
    res.send(movie);
});

router.post('/', auth, async(req,res) => {
   
    const { error } = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('invalid genre! ')

    let movie = new Movie({
        title : req.body.title,
        genre : {
            _id : genre._id,
            name : genre.name,
        },
        numberInStock : req.body.numberInStock,
        dailyRentalRate : req.body.dailyRentalRate
     });   
    movie = await movie.save();
    res.send(movie);

});


router.delete('/:id', [auth, admin], async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id)
    if(!movie){
        res.status(404).send('movie with given id not found');
    }

    res.send(genre);
});



module.exports = router;