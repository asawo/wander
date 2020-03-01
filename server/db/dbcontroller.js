const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10
const pgp = require('pg-promise')()
const CONNECTION_STRING =
	process.env.DATABASE_URL || 'postgres://localhost:5432/wander'
const db = pgp(CONNECTION_STRING)

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
				res
					.status(400)
					.send({ message: 'Invalid username or password', error: error })
			}
		})
	} else {
		res.status(400).send({ message: 'Invalid username or password' })
	}
}

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

// ################################################
// DB queries and handling
// ################################################

module.exports = {
	registerUser: function(req, res) {
		let username = req.body.username
		let password = req.body.password

		db.oneOrNone('SELECT userid FROM users WHERE username = $1', [username])
			.then(user => createAccount(user, req, res, username, password))
			.catch(e => console.error(e))
	},
	signInUser: function(req, res) {
		let username = req.body.username
		let password = req.body.password

		db.oneOrNone(
			'SELECT userid, username, password FROM users WHERE username = $1',
			[username]
		)
			.then(user => createSession(user, res, req, username, password))
			.catch(e => console.error(e))
	},
	addDoggo: function(req, res) {
		let userId = req.session.user.userId
		let doggoName = req.body.doggoName
		let description = req.body.description

		db.none(
			'INSERT INTO doggos(doggoname, description, userid) VALUES($1,$2,$3)',
			[doggoName, description, userId]
		)
			.then(() => {
				res.status(200).send({ message: 'SUCCESS' })
				console.log(`Added ${doggoName}!`)
			})
			.catch(e => console.error(e))
	}
}