const jsonwebtoken = require('jsonwebtoken')
const User = require('../model/user')
// const News = require('../model/news')

// custom middleware check for jsonwebtoken
const auth = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].replace('Bearer ', '')
        const verifiedToken = jsonwebtoken.verify(token, 'my-little-secret')
        const user = await User.findOne({ _id: verifiedToken.id, 'tokens.token': token }).populate('newsCount')
        
        if (!user) {
            throw new Error()
        }

        req.user = user
        req.token = token

        next()
    } catch (error) {
        return res.status(400).send({ error: 'Nutze ein gültigen Account' })
    }
}

module.exports = auth