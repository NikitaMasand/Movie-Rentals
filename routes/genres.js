const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const express = require('express');
const {validate, Genre } = require('../models/genre')
const router = express.Router();


// router.reqType(route, middleware(optional), route handler(callback function))
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres)
});

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    // const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre){
        res.status(404).send('genre with given id not found');
    }
    res.send(genre);
});

router.put('/:id', auth, async (req,res) => {
    const { error } = validate(req.body);
    const genre = await Genre.findByIdAndUpdate(req.params.id, {name : req.body.name }, { new : true })
    // const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre){
        res.status(404).send('genre with given id not found');
    }
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    // genre.name = req.body.name;
    res.send(genre);
});

router.post('/', auth, async(req,res) => {
    const { error } = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    let genre = new Genre({ name : req.body.name }); 
    genre = await genre.save();
    res.send(genre);

});

router.delete('/:id', [auth,admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)
    // const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre){
        res.status(404).send('genre with given id not found');
    }

    // const index = genres.indexOf(genre);
    // genres.splice(index,1);

    res.send(genre);
});

module.exports = router;