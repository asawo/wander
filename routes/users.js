const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

// Setting up body parser to parse json

router.get('/', (req, res) => {
	let accounts = {
		account: 'arthur',
		password: 'secret'
	}

	res.json(accounts)
})

// {account: "arthur", password: "secret hee hee"}
router.post('/login', (req, res) => {
	let account = req.body.account
	let password = req.body.password
	console.log(account + ' ' + password)
	res.send(account + ' ' + password)
})

router.get('/all', (req, res) => {
	// get all users
	let users = [
		{
			username: 'arthur',
			password: 'secret'
		},
		{
			username: 'arthur1',
			password: 'secret'
		},
		{
			username: 'arthur2',
			password: 'secret'
		}
	]
	res.json(users)
})

router.get('/users/:userId', (req, res) => {
	// get users by user Id
})

router.post('/add-user', (req, res) => {
	// create a new user
})

router.delete('/users', (req, res) => {
	// delete a user
})

module.exports = router
