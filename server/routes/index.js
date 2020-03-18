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

	db.userExists(formData.username)
		.then(result => {
			if (result === null) {
				db.createAccount(formData)
					.then(result => {
						if (result === null) {
							res.status(200).json({ Success: `${formData.username} created` })
						} else {
							res.status(400).json({ Error: 'Something went wrong' })
						}
					})
					.catch(error => {
						console.log('error', error.message)
					})
			} else {
				res.status(400).json({ Error: `${formData.username} already exists` })
			}
		})
		.catch(error => {
			console.log('error', error.message)
		})
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
