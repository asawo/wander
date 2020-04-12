const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10
const pgp = require('pg-promise')({ noLocking: true })
const CONNECTION_STRING =
	process.env.DATABASE_URL || 'postgres://localhost:5432/wander'
const db = pgp(CONNECTION_STRING)

//################################################
// DB queries and handling
//################################################

const userExists = async (username) => {
	const result = await db.oneOrNone(
		'SELECT userid FROM users WHERE username = $1',
		[username]
	)
	return result
}

const createAccount = async (formData) => {
	const hash = await bcrypt.hash(formData.password, SALT_ROUNDS)

	if (hash !== null) {
		const result = await db.none(
			'INSERT INTO users(username, password) VALUES($1,$2)',
			[formData.username, hash]
		)
		return { result, formData }
	}
	return formData.username
}

const deleteUser = async (userId) => {
	const result = await db.oneOrNone('DELETE FROM users WHERE userid = $1', [
		userId,
	])
	return result
}

const getCredentials = async (username) => {
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
		'SELECT doggoid, doggoname, description, imageurl, username FROM doggos ORDER BY dateupdated DESC'
	)
	return result
}

const addDoggo = async (dogData) => {
	const result = await db.none(
		'INSERT INTO doggos(doggoname, description, imageurl, userid, username) VALUES($1,$2,$3,$4,$5)',
		[
			dogData.doggoName,
			dogData.description,
			dogData.imageUrl,
			dogData.userId,
			dogData.username,
		]
	)
	return result
}

const loadMyDoggos = async (userId) => {
	const result = await db.any(
		'SELECT doggoname, description, imageurl FROM doggos WHERE userid = $1 ORDER BY dateupdated DESC',
		[userId]
	)
	return result
}

const getDoggo = async (doggoName) => {
	const result = await db.one(
		'SELECT doggoname, doggoid, imageurl FROM doggos WHERE doggoname = $1',
		[doggoName]
	)
	return result
}

const deleteDoggo = async (doggoId) => {
	const result = await db.none('DELETE FROM doggos WHERE doggoid = $1', [
		doggoId,
	])
	return result
}

const updateDoggo = async (doggoId, newDogName, newDogDesc) => {
	const result = await db.any(
		'UPDATE doggos SET doggoname = $1, description = $2 WHERE doggoid = $3 RETURNING doggoname, description, dateupdated',
		[newDogName, newDogDesc, doggoId]
	)
	return result
}

// #####################
// getLikes, likeDoggo
// #####################
const getLikes = async (doggoId) => {
	const result = await db.one(
		'SELECT SUM(likecount) FROM likes WHERE doggoid = $1',
		[doggoId]
	)
	return result
}

const likeDoggo = async (userId, doggoId) => {
	const result = await db.any(
		'INSERT INTO likes(doggoid, userid) VALUES($1,$2) RETURNING doggoid, userid, dateliked',
		[doggoId, userId]
	)
	return result
}

module.exports = {
	createAccount,
	userExists,
	deleteUser,
	getCredentials,
	authenticateUser,
	addDoggo,
	loadMyDoggos,
	loadAll,
	getDoggo,
	deleteDoggo,
	updateDoggo,
	db,
	bcrypt,
	getLikes,
	likeDoggo,
}
