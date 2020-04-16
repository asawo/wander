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
		'SELECT doggos.doggoid, doggoname, imageurl, description, username, SUM(likes.likecount) AS likestotal FROM doggos LEFT JOIN likes ON doggos.doggoid = likes.doggoid GROUP BY doggos.doggoid, likes.likecount ORDER BY dateupdated DESC'
	)
	return result
}

const checkIfLiked = async (userId, doggoId) => {
	const result = await db.oneOrNone(
		'SELECT * FROM likes WHERE userid = $1 AND doggoid = $2;',
		[userId, doggoId]
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

const likeDoggo = async (userId, doggoId) => {
	const result = await db.any(
		'INSERT INTO likes(doggoid, userid) VALUES($1,$2) RETURNING doggoid, userid, dateliked',
		[doggoId, userId]
	)
	return result
}

const unlikeDoggo = async (userId, doggoId) => {
	const result = await db.any(
		'DELETE FROM likes WHERE userid = $1 AND doggoid = $2 RETURNING doggoid, userid, dateliked',
		[userId, doggoId]
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
	likeDoggo,
	unlikeDoggo,
	checkIfLiked,
}
