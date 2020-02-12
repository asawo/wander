const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()
const CONNECTION_STRING = 'postgres://localhost:5432/wander' // or process.env.blah
const db = pgp(CONNECTION_STRING)
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10

app.use(bodyParser.json())

// Serve signin.html page
app.use('/', express.static(path.join(__dirname, '../client')))
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/signup.html'))
})

// Serve home.html page
app.get('/home', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/home.html'))
})

// Login page
app.post('/signin', (req, res) => {
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
						console.log('SUCCESS, redirecting to /home')
						res.send({ authenticated: true })
						// res.status(number).send('message')
					} else {
						console.log('Invalid username or password')
						res.send({ message: 'Invalid username or password' })
					}
				})
			} else {
				console.log('Invalid username or password')
				res.send({ message: 'Invalid username or password' })
			}
		})
		.catch(e => console.log(e))
})

// Register users
app.post('/signup', (req, res) => {
	let username = req.body.username
	let password = req.body.password

	db.oneOrNone('SELECT userid FROM users WHERE username = $1', [username]).then(
		user => {
			if (user) {
				res.send({ message: `User ${username} already exists` })
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
								res.send({ registration: 'SUCCESS' })
								console.log(`User created: ${username}`)
							})
							.catch(e => console.log(e))
					}
				})
			}
		}
	)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server is listening at :${PORT}`)
})
