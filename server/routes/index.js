const express = require('express')
const router = express.Router()
const path = require('path')
const db = require('../controllers/dbcontroller.js')

// Serve sign in page
router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../../client/signup.html'))
})

router.post('/signin', db.signInUser)

router.post('/signup', db.registerUser)

router.get('/logout', (req, res, next) => {
	if (req.session) {
		req.session.destroy(error => {
			if (error) {
				next(error)
			} else {
				res.redirect('/')
			}
		})
	}
})

module.exports = router
