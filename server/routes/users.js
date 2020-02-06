const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

router.use(bodyParser.json())

// Session starts if a user is added via /add-user
// function authenticate(req, res, next) {
// 	if (req.session) {
// 		if (req.session.username) {
// 			next()
// 		} else {
// 			res.redirect('/users/add-user')
// 		}
// 	}
// }

router.get('/', (req, res) => {
	let accounts = {
		account: req.session.username,
		age: req.session.age
	}

	res.json(accounts)
})

// POST a JSON with account and password key
router.post('/login', (req, res) => {
	let account = req.body.account
	let password = req.body.password
	console.log(account + ' ' + password)
	res.send(account + ' ' + password)
})

// get all users
router.get('/all', (req, res) => {
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

// get users by user Id
router.get('/users/:userId', (req, res) => {})

// create new user
router.post('/add-user', (req, res) => {
	let username = req.body.username
	let age = req.body.age

	if (req.session) {
		req.session.username = username
		req.session.age = age
	}
})

// delete a user
router.delete('/users', (req, res) => {})

module.exports = router
