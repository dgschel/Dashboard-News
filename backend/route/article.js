const express = require('express')
const router = express.Router()
const Article = require('../model/article')

router.post('', (req, res) => {
    res.send()
})

router.get('', async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0
        const limit = parseInt(req.query.limit) || 0

        // dont like this solution but thats the best i get right know since this is a challenge to make that project in 3 days
        const total = await Article.estimatedDocumentCount()
        const articles = await Article.find({}).skip(skip).limit(limit)
        const hasMore = total - (skip + limit) > 0 ? true : false

        // if (articles.length === 0) {
        //     return res.status(404).send() // or status 200 since this was a valid request
        // }

        return res.send({ total, hasMore, articles })
    } catch (e) {
        return res.status(500).send({ error: e })
    }
})

router.patch(':id', (req, res) => {
    res.send()

})

router.delete(':id', (req, res) => {
    res.send()
})

module.exports = router