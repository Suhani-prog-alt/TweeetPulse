const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default;

const userSchema = new mongoose.Schema({
    age: {
        type: Number,
        required: true,
        min: [1, 'Age must be positive']
    },
    address: {
        location: {
            type: String,
            required: true
        }
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
