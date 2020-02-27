const express = require('express')
const bcrypt = require('bcrypt')
const pgp = require('pg-promise')()
const CONNECTION_STRING =
	process.env.DATABASE_URL || 'postgres://localhost:5432/wander'
const db = pgp(CONNECTION_STRING)
const router = express.Router()
const path = require('path')
const SALT_ROUNDS = 10
// const dbController = require('dbcontroller')

// handle logout
router.get('/logout', (req, res, next) => {
	console.log(req.session.user)
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

// Sign in page
router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../../client/signup.html'))
})

// create session when sign in is successful at /signin endpoint
const createSession = (user, res, req, username, password) => {
	if (user) {
		bcrypt.compare(password, user.password, function(error, result) {
			if (result) {
				console.log('SUCCESS, creating session and redirecting to /users/home')

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
}
// Handle sign-in
router.post('/signin', (req, res) => {
	let username = req.body.username
	let password = req.body.password

	db.oneOrNone(
		'SELECT userid, username, password FROM users WHERE username = $1',
		[username]
	)
		.then(user => createSession(user, res, req, username, password))
		.catch(e => console.error(e))
})

// create account passed into the /signup endpoint
const createAccount = (user, req, res, username, password) => {
	if (user) {
		res.status(400).send({ message: `User ${username} already exists` })
	} else {
		bcrypt.hash(password, SALT_ROUNDS, function(error, hash) {
			if (error == null) {
				db.none('INSERT INTO users(username, password) VALUES($1,$2)', [
					username,
					hash
				])
					.then(() => {
						res.status(200).send({ registration: 'SUCCESS' })
						console.log(`User created: ${username}`)
					})
					.catch(e => console.log(e))
			}
		})
	}
}

// register
router.post('/signup', (req, res) => {
	let username = req.body.username
	let password = req.body.password

	// dbController
	// 	.checkUser(username)
	db.oneOrNone('SELECT userid FROM users WHERE username = $1', [
		username
	]).then(user => createAccount(user, req, res, username, password))
})

module.exports = router
