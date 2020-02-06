const express = require('express')
const app = express()
const path = require('path')
const userRoutes = require('./routes/users')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()
const CONNECTION_STRING = 'postgres://localhost:5432/wander' // or process.env.blah

// Use user routes
app.use('/server/routes/users', userRoutes)

// Serve signin.html page
app.use('/', express.static(path.join(__dirname, '../client')))
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/signup.html'))
})

app.use(bodyParser.json())

const db = pgp(CONNECTION_STRING)

// Register users
app.post('/signup', (req, res) => {
	let username = req.body.username
	let password = req.body.password

	db.oneOrNone('SELECT userid FROM users WHERE username = $1', [username]).then(
		user => {
			if (user) {
				console.log('user already exists')
				// Render the above message on page
			} else {
				db.none('INSERT INTO users(username,password) VALUES($1,$2)', [
					username,
					password
				])
					.then(() => {
						console.log('SUCCESS')
					})
					.catch(error => console.log(error))
			}
		}
	)

	console.log(username)
	console.log(password)

	res.send('register')
})

// listen here
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server is listening at :${PORT}`)
})
