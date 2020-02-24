const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
// const bcrypt = require('bcrypt')
const session = require('express-session')
const pgp = require('pg-promise')()
const userRoutes = require('../routes/users')
const indexRoutes = require('../routes/index')

const PORT = process.env.PORT || 3000
const CONNECTION_STRING =
	process.env.DATABASE_URL || 'postgres://localhost:5432/wander'
const app = express()

db = pgp(CONNECTION_STRING)

app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../client')))

app.use(
	session({
		secret: 'blahblah',
		resave: false,
		saveUninitialized: false
	})
)

app.use('/', indexRoutes)
app.use('/users', userRoutes)

app.listen(PORT, () => {
	console.log(`Server is listening at :${PORT}`)
})

module.exports = app
