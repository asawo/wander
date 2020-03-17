const express = require('express')
const router = express.Router()
const path = require('path')
const db = require('../controllers/dbcontroller.js')

// Serve sign in page
router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../../client/signup.html'))
})

router.get('/all-doggos', db.loadAll)

router.post('/signin', db.signInUser)

router.post('/signup', (req, res) => {
	const formData = {
		username: req.body.username,
		password: req.body.password
	}

	console.log('db.userExists() returns: ', db.userExists(formData.username))

	// if (db.userExists(formData) === null) {
	// 	db.createAccount(formData).then(response => {
	// 		console.log('dbCreateAccount response ', response)
	// 		if (response === 'Success') {
	// 			res.status(200).json({ message: 'Account created!' })
	// 		} else {
	// 			res.status(400).json({ errorCode: 'UserExists' })
	// 		}
	// 	})
	// } else {
	// 	console.log('form data !== null', db.userExists(formData))
	// }
})

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
