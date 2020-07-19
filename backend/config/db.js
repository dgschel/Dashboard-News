const mongoose = require('mongoose')

mongoose.connect(process.env.DB, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(result => {
        console.log('database connect succesfully')
    }).catch(error => {
        console.log('error conntect to database')
    })