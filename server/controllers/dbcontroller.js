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
		return { result, formData } // should be null if everything was successful
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
		return { result, user }
	}
	return false
}

const loadAll = async () => {
	const result = await db.any(
		'SELECT doggoname, description, imageurl FROM doggos ORDER BY dateupdated DESC'
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

const loadMyDoggos = async userId => {
	const result = await db.any(
		'SELECT doggoname, description, imageurl FROM doggos WHERE userid = $1 ORDER BY dateupdated DESC',
		[userId]
	)
	return result
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
