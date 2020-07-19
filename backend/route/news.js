const express = require('express')
const router = express.Router()

const News = require('../model/news')
const auth = require('../middleware/auth')

router.post('/', auth, async (req, res) => {
    try {
        const news = new News(req.body)
        news.userId = req.user._id
        news.user = req.user // append loggedIn user as embedded document and then populate it if necesarry
        await news.save()
        return res.status(201).send(news)
    } catch (e) {
        return res.status(400).send({ error: e })
    }
})

router.get('/', async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0
        const limit = parseInt(req.query.limit) || 0

        const total = await News.estimatedDocumentCount()
        const news = await News.find({}).skip(skip).limit(limit).populate('user')
        const hasMore = total - (skip + limit) > 0 ? true : false

        // if (news.length === 0) {
        //     return res.status(404).send() // or status 200 since this was a valid request
        // }

        return res.send({ total, hasMore, news })
    } catch (error) {
        return res.status(400).send({ error })
    }
})

router.get('/me', auth, async (req, res) => {
    try {
        const news = await News.find({ user: req.user })
        // console.log(news)
        return res.send(news)
    } catch (error) {
        return res.status(400).send({ error })
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const news = await News.findOne({ _id: req.params.id })

        // not found handle caase with 404?
        if (!news) {
            throw new Error('No news found')
        }

        return res.send(news)
    } catch (error) {
        return res.status(400).send({ error })
    }
})

router.patch('/:id', auth, async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true })
        return res.send(news)
    } catch (error) {
        return res.status(400).send({ error })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await News.findByIdAndDelete(req.params.id)
        return res.send()
    } catch (error) {
        return res.status(400).send({ error })
    }
})

module.exports = router