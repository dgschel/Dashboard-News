const mongoose = require('mongoose')
const validator = require('validator')

const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 8
    },
    avatar: String,
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
}, { timestamps: true, toJSON: { virtuals: true } })

userSchema.virtual('news', {
    ref: 'News', // Model name from which to populate
    localField: '_id', // my local filed to match the values => pointing to user._id
    foreignField: 'userId', // in news model i have a foreign key from which i can populate
    justOne: false,
})

userSchema.virtual('newsCount', {
    ref: 'News',
    localField: '_id',
    foreignField: 'userId',
    count: true // only get the num of docs 
})

userSchema.pre('save', async function (next) {
    // Hook into save and modify doc
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// custom method callable directly on the document
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jsonwebtoken.sign({ id: user._id }, 'my-little-secret')
    user.tokens = user.tokens.concat({ token })
    await user.save() // save the token to database
    return token
}

// custom method callable from the schema
userSchema.statics.findByCredentials = async function (email, password) {
    const user = await userModel.findOne({ email }).populate('newsCount')

    if (!user) {
        // user not found with email
        throw new Error('Login invalid')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        // wrong password
        throw new Error('Login invalid')
    }

    return user
}

const userModel = mongoose.model('User', userSchema)

module.exports = userModel