const express = require('express');
const router = express.Router();
const Tweet = require('../models/tweet');

// Middleware to check if logged in
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
};

// READ - List only the logged-in user's tweets
router.get('/', isLoggedIn, async (req, res) => {
    const tweets = await Tweet.find({ username: req.user.username });
    res.render('tweets', { tweets });
});

// CREATE - Show form to create new tweet (Helpful for testing)
router.get('/new', isLoggedIn, (req, res) => {
    res.render('new_tweet');
});

// CREATE - Process new tweet
router.post('/', isLoggedIn, async (req, res) => {
    const { tweetContent } = req.body;
    const tweet = new Tweet({
        tweetContent,
        username: req.user.username
    });
    await tweet.save();
    res.redirect('/tweets');
});

// EDIT - Show form to edit tweet
router.get('/:id/edit', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const tweet = await Tweet.findById(id);
    if (!tweet || tweet.username !== req.user.username) {
        return res.redirect('/tweets');
    }
    res.render('edit_tweet', { tweet });
});

// UPDATE - Process tweet edit
router.post('/:id/edit', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { tweetContent } = req.body;
    const tweet = await Tweet.findById(id);
    
    if (!tweet || tweet.username !== req.user.username) {
        return res.redirect('/tweets');
    }

    tweet.tweetContent = tweetContent;
    await tweet.save();
    res.redirect('/tweets');
});

// DELETE - Delete a tweet
router.post('/:id/delete', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const tweet = await Tweet.findById(id);
    
    if (!tweet) {
        return res.redirect('/tweets');
    }

    // Check if the current user is the author
    if (tweet.username !== req.user.username) {
        return res.redirect('/tweets'); // Unauthorized
    }

    await Tweet.findByIdAndDelete(id);
    res.redirect('/tweets');
});

module.exports = router;
