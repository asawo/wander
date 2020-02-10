const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const pgp = require('pg-promise')()

const CONNECTION_STRING = 'postgres://localhost:5432/wander' // or process.env.blah
const SALT_ROUNDS = 10

// Serve signin.html page
app.use('/', express.static(path.join(__dirname, '../client')))
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/signup.html'))
})

app.use(bodyParser.json())

const db = pgp(CONNECTION_STRING)

// Login page
app.post('/signIn', (req, res) => {
	let username = req.body.username
	let password = req.body.password

	db.oneOrNone(
		'SELECT userid,username,password FROM users WHERE username = $1',
		[username]
	).then(user => {
		if (user) {
		} else {
			console.log('Invalid username or password')
		}
	})
})

// Register users
app.post('/signup', (req, res) => {
	let username = req.body.username
	let password = req.body.password

	db.oneOrNone('SELECT userid FROM users WHERE username = $1', [username]).then(
		user => {
			if (user) {
				console.log(`User ${username} already exists`)
				// Render the above message on page
			} else {
				bcrypt.hash(password, SALT_ROUNDS, function(error, hash) {
					if (error == null) {
						db.none('INSERT INTO users(username,password) VALUES($1,$2)', [
							username,
							hash
						])
							.then(() => {
								// Action after creating the account
								console.log(`User created: ${username}`)
							})
							.catch(e => console.log(e))
					}
				})
			}
		}
	)
})

// listen here
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server is listening at :${PORT}`)
})
