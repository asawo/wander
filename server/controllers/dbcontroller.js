const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10
const pgp = require('pg-promise')()
const CONNECTION_STRING =
	process.env.DATABASE_URL || 'postgres://localhost:5432/wander'
const db = pgp(CONNECTION_STRING)

//################################################
// DB queries and handling
//################################################

const userExists = async username => {
	const result = await db.oneOrNone(
		'SELECT userid FROM users WHERE username = $1',
		[username]
	)
	return result
}

const createAccount = async formData => {
	const hash = await bcrypt.hash(formData.password, SALT_ROUNDS)

	if (hash !== null) {
		const result = await db.none(
			'INSERT INTO users(username, password) VALUES($1,$2)',
			[formData.username, hash]
		)
		return result // should be null if everything was successful
	}
	return formData.username
}

const getCredentials = async username => {
	const userCredentials = await db.oneOrNone(
		'SELECT userid, username, password FROM users WHERE username = $1',
		[username]
	)
	return userCredentials
}

const authenticateUser = async (user, password) => {
	if (user) {
		const result = await bcrypt.compare(password, user.password)
		return result
	}
	return false
}

const loadAll = async () => {
	const result = await db.any(
		'SELECT doggoname, description, imageurl FROM doggos'
	)

	return result
}

const addDoggo = async dogData => {
	const result = await db.none(
		'INSERT INTO doggos(doggoname, description, imageurl, userid) VALUES($1,$2,$3,$4)',
		[dogData.doggoName, dogData.description, dogData.imageUrl, dogData.userId]
	)

	return result
}

// Refactored above
// Refactoring below

const loadMyDoggos = (req, res) => {
	let userId = req.session.user.userId

	db.any(
		'SELECT doggoname, description, imageurl FROM doggos WHERE userid = $1',
		[userId]
	)
		.then(doggos => {
			res.status(200).send({ doggos: doggos })
		})
		.catch(e => console.error(e))
}

module.exports = {
	createAccount,
	userExists,
	getCredentials,
	authenticateUser,
	addDoggo,
	loadMyDoggos,
	loadAll
}
