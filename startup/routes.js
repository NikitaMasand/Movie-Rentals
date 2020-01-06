const express = require('express');
const genres = require('../routes/genres'); 
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');

module.exports = function(app) {
    app.use(express.json());
/*
not writing auth middleware here because we don't want to check for token at every end point
eg: without logging in, user can see the list of customers, genres, etc.
*/
    app.use('/api/genres',genres);
    app.use('/api/customers',customers);
    app.use('/api/movies',movies);
    app.use('/api/rentals',rentals);
    app.use('/api/users',users);
    app.use('/api/auth',auth)
}