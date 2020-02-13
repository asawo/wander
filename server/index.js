import * as express from 'express'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import * as bcrypt from 'bcrypt'
import * as session from 'express-session'
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
						console.log('SUCCESS, redirecting to /home')
						// put username and userIf in the session
						if (req.session) {
							req.session.user = {
								userId: user.userid,
								username: user.username
							}
						}

						res.send({ authenticated: true, user: username })
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

app.listen(PORT, () => {
	console.log(`Server is listening at :${PORT}`)
})
