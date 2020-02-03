const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')
const userRoutes = require('./routes/users')
const pgp = require('pg-promise')()
const connectionString = 'postgres://localhost:5432/wander' // or process.env.blah
const db = pgp(connectionString)

// Insert one
// db.none(
// 	'INSERT INTO accounts(username, password, email) VALUES($1, $2, $3) RETURNING id',
// 	['asawo', 'fakepassword', 'fakeemail@gmail.com']
// )
// 	.then((data) => {
// 		console.log(data)
// 	})
// 	.then(error => console.log(error))

db.none('DELETE FROM accounts WHERE id = $1', [1])
	.then(() => {
		console.log('DELETED')
	})
	.catch(error => console.log(error))

app.use('/server/routes/users', userRoutes)

// Serve signin.html page
app.use('/', express.static(path.join(__dirname, '../client')))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/signin.html'))
})

// listen here
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server is listening at :${PORT}`)
})

// TODO:
// - connect to db and run some queries
// - maybe sequelize
// - bcrypt - maybe later
// -
