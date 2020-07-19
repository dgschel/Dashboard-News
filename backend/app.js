require('dotenv').config()
require('./config/db')
const path = require('path')
const newsRouter = require('./route/news')
const articleRouter = require('./route/article')
const userRouter = require('./route/user')
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/api/news/', newsRouter)
app.use('/api/articles/', articleRouter)
app.use('/api/user/', userRouter)
app.use('/images', express.static(path.join('backend/uploads')))

// create a link to my dist build directory
const distDir = path.join(__dirname, "../dist");
app.use(express.static(distDir));

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(distDir)
    console.log(`Server listen on port ${port}`)
})