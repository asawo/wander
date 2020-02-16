const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const session = require('express-session')
const pgp = require('pg-promise')()

const PORT = process.env.PORT || 3000
const CONNECTION_STRING =
	process.env.DATABASE_URL || 'postgres://localhost:5432/wander'
const db = pgp(CONNECTION_STRING)
const SALT_ROUNDS = 10
const app = express()

app.use(bodyParser.json())
app.use(
	session({
		secret: 'blahblah',
		resave: false,
		saveUninitialized: false
	})
)
app.use('/', express.static(path.join(__dirname, '../client')))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/signup.html'))
})

app.get('/home', (req, res) => {
	if (req.session.user) {
		res.sendFile(path.join(__dirname, '../client/home.html'))
		// res.send({ username: req.session.user.username })
	} else {
		res.sendFile(path.join(__dirname, '../client/signup.html'))
	}
})

// Sign in page
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
						console.log('SUCCESS, creating session and redirecting to /home')

						if (req.session) {
							req.session.user = {
								userId: user.userid,
								username: user.username
							}
						}

						res.status(200).send({ authenticated: true, user: username })
						// res.status(number).send('message')
					} else {
						res.status(400).send({ message: 'Invalid username or password' })
					}
				})
			} else {
				res.status(400).send({ message: 'Invalid username or password' })
			}
		})
		.catch(e => console.error(e)) // change
	// test API routes, db controllers, integration with db (E2E, unit and integration test)
})

// Register users
app.post('/signup', (req, res) => {
	let username = req.body.username
	let password = req.body.password

	db.oneOrNone('SELECT userid FROM users WHERE username = $1', [username]).then(
		user => {
			if (user) {
				res.status(400).send({ message: `User ${username} already exists` })
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
								res.status(200).send({ registration: 'SUCCESS' })
								console.log(`User created: ${username}`)
							})
							.catch(e => console.log(e))
					}
				})
			}
		}
	)
})

app.listen(PORT, () => {
	console.log(`Server is listening at :${PORT}`)
})
