const express = require('express')
const router = express.Router()
const path = require('path')
const db = require('../controllers/dbcontroller.js')
const func = require('./functions')

// Serve sign in page
router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../../client/signup.html'))
})

router.get('/all-doggos', db.loadAll)

router.post('/signin', func.signIn)

router.post('/signup', func.registerUser)

router.get('/logout', func.logOut)

module.exports = router
