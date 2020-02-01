const express = require('express')
const app = express()
const session = require('express-session')
const userRoutes = require('./routes/users')

app.use('/users', userRoutes)

app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: true
	})
)

app.use(express.static('views'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server is listening at :${PORT}`)
})
