const mongoose = require('mongoose')

// we use news for the user so that he can push new news into collection and sees those when he logged in
const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: { // will be used for exactly one user
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    userId: { // used as foreign key to populate one user and many news
        type: mongoose.Types.ObjectId,
        required: true
    }
}, { timestamps: true, toJSON: { virtuals: true } })

const newsModel = mongoose.model('News', newsSchema)

module.exports = newsModel