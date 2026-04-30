const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

const Tweet = require('../models/tweet');

router.get('/', async (req, res) => {
    const tweets = await Tweet.find({});
    res.render('home', { tweets });
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { username, password, age, location } = req.body;
        const user = new User({ username, age, address: { location } });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/tweets');
        });
    } catch (e) {
        console.log(e);
        res.redirect('/register');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect('/tweets');
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;
