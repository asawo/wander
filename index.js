const express = require('express')
const app = express()
const userRoutes = require('./routes/users')
const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.use('/users', userRoutes)

app.use(express.static('views'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server is listening at :${PORT}`)
})
