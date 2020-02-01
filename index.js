const express = require('express')
const app = express()
const session = require('express-session')
const userRoutes = require('./routes/users')
const pgp = require('pg-promise')()
const connectionString = 'postgres://localhost:5432/wander'
const db = pgp(connectionString)

console.log(db)

app.use('/users', userRoutes)

app.use(
	session({
		secret: 'session session',
		resave: false,
		saveUninitialized: true
	})
)

app.use(express.static('views'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server is listening at :${PORT}`)
})
