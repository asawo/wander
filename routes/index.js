const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const path = require('path')
const SALT_ROUNDS = 10

router.use('/', express.static(path.join(__dirname, '../client')))

// Sign in page
router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/signup.html'))
})

router.post('/signin', (req, res) => {
	let username = req.body.username
	let password = req.body.password

	db.oneOrNone(
		'SELECT userid, username, password FROM users WHERE username = $1',
		[username]
	)
		.then(user => {
			if (user) {
				bcrypt.compare(password, user.password, function(error, result) {
					if (result) {
						console.log(
							'SUCCESS, creating session and redirecting to /users/home'
						)

						if (req.session) {
							req.session.user = {
								userId: user.userid,
								username: user.username
							}
						}

						res.status(301).send({ authenticated: true, user: username })
					} else {
						res.status(400).send({ message: 'Invalid username or password' })
					}
				})
			} else {
				res.status(400).send({ message: 'Invalid username or password' })
			}
		})
		.catch(e => console.error(e)) // change
	// test API routes, db controllers, integration with db (E2E, unit and integration test)
})

// register
router.post('/signup', (req, res) => {
	let username = req.body.username
	let password = req.body.password

	db.oneOrNone('SELECT userid FROM users WHERE username = $1', [username]).then(
		user => {
			if (user) {
				res.status(400).send({ message: `User ${username} already exists` })
				// Render the above message on page
			} else {
				bcrypt.hash(password, SALT_ROUNDS, function(error, hash) {
					if (error == null) {
						db.none('INSERT INTO users(username, password) VALUES($1,$2)', [
							username,
							hash
						])
							.then(() => {
								// Action after creating the account
								res.status(200).send({ registration: 'SUCCESS' })
								console.log(`User created: ${username}`)
							})
							.catch(e => console.log(e))
					}
				})
			}
		}
	)
})

module.exports = router
