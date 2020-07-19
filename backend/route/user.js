const fs = require('fs')
const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const User = require('../model/user')

const MYME_TYPES = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg'
}

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // the path to the folder where the file will be save
        const path = `backend/uploads/${req.user._id}`

        if (!fs.existsSync(path)) {
            fs.mkdirSync(path)
        }

        cb(null, path)
    },
    filename: function (req, file, cb) {
        // the file name under the destination
        const ext = MYME_TYPES[file.mimetype]
        const name = 'avatar.' + ext
        cb(null, name)
    }
})

const upload = multer({ storage: storage })

router.post('/register', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        return res.status(201).send({ token, user })
    } catch (e) {
        return res.status(400).send('Account konnte nicht erstellt werden')
    }

})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        return res.send({ token, user })
    } catch (e) {
        return res.status(400).send('Fehler beim einloggen')
    }
})

router.patch('/update', auth, async (req, res) => {
    try {
        req.user.username = req.body.username
        await req.user.save()
        return res.send(req.user)
    } catch (e) {
        return res.status(400).send('Fehler beim updaten deines Profiles')
    }
})

router.patch('/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        const avatarPath = `${req.protocol}://${req.get('host')}/images/${req.user._id}/${req.file.filename}`
        await req.user.updateOne({ avatar: avatarPath })
        return res.send()
    } catch (error) {
        return res.status(400).send({ error })
    }
})

router.get('/me', auth, async (req, res) => {
    return res.send({ token: req.token, user: req.user })
})


module.exports = router