const express = require('express')
const router = express.Router()
const path = require('path')
const CONNECTION_STRING =
	process.env.DATABASE_URL || 'postgres://localhost:5432/wander'
const pgp = require('pg-promise')()
const db = pgp(CONNECTION_STRING)

module.exports = {
	// check db for existing user
	checkUser: function(username) {
		console.log(username)
		// db.oneOrNone('SELECT userid FROM users WHERE username = $1', [username])
	}
}
