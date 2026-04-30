const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const User = require('./models/user');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/web_project_2')
    .then(() => console.log('Connected to DB'))
    .catch(err => console.log(err));

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global variables for templates
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// Routes
const indexRoutes = require('./routes/index');
const tweetRoutes = require('./routes/tweets');

app.use('/', indexRoutes);
app.use('/tweets', tweetRoutes);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});