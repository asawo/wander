const express = require('express')
const app = express()
const path = require('path')
const userRoutes = require('./routes/users')

app.use('/users', userRoutes)

app.use(express.static('views'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server is listening at :${PORT}`)
})
