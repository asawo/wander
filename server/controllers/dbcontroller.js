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

//################################################
// DB queries and handling
//################################################

const registerUser = (req, res) => {
	let username = req.body.username
	let password = req.body.password

	db.oneOrNone('SELECT userid FROM users WHERE username = $1', [username])
		.then(user => createAccount(user, req, res, username, password))
		.catch(e => console.error(e))
}

const signInUser = (req, res) => {
	let username = req.body.username
	let password = req.body.password

	db.oneOrNone(
		'SELECT userid, username, password FROM users WHERE username = $1',
		[username]
	)
		.then(user => createSession(user, res, req, username, password))
		.catch(e => console.error(e))
}

const addDoggo = (req, res) => {
	let userId = req.session.user.userId
	let doggoName = req.body.doggoName
	let imageUrl = req.body.doggoImage
	let description = req.body.description
	console.log('in dbcontroller/addDog req.body: ', req.body)

	db.none(
		'INSERT INTO doggos(doggoname, description, imageurl, userid) VALUES($1,$2,$3,$4)',
		[doggoName, description, imageUrl, userId]
	)
		.then(() => {
			res.status(200).send({ message: 'SUCCESS' })
			console.log(`Added ${doggoName}!`)
		})
		.catch(e => console.error(e))
}

const loadMyDoggos = (req, res) => {
	let userId = req.session.user.userId

	db.any('SELECT doggoname, description FROM doggos WHERE userid = $1', [
		userId
	])
		.then(doggos => {
			res.status(200).send({ doggos: doggos })
		})
		.catch(e => console.error(e))
}

module.exports = {
	registerUser: registerUser,
	signInUser: signInUser,
	addDoggo: addDoggo,
	loadMyDoggos: loadMyDoggos
}
