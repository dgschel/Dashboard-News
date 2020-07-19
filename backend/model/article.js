const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    source: {
        id: String,
        name: String
    },
    author: String,
    title: String,
    description: String,
    url: String,
    urlToImage: String,
    publishedAt: String,
    content: String
})

const articleModel = mongoose.model('Article', articleSchema)

module.exports = articleModel