const express = require('express')
const router = express.Router()
const path = require('path')

router.use('/', express.static(path.join(__dirname, '../client')))

router.get('/home', (req, res) => {
	if (req.session.user) {
		res.sendFile(path.join(__dirname, '../client/home.html'))
		// res.send({ username: req.session.user.username })
	} else {
		res.redirect('/')
	}
})

// add doggos
router.get('/add-doggos', (req, res) => {
	if (req.session.user) {
		res.sendFile(path.join(__dirname, '../client/add-doggos.html'))
		// res.send({ username: req.session.user.username })
	} else {
		res.redirect('/')
	}
})

router.post('/add-doggos', (req, res) => {
	let username = req.session.username
	let doggoName = req.body.doggoName
	let doggoImage = req.body.doggoImage
	let description = req.body.description

	res.status(200).send({ message: 'hi' })
})

module.exports = router
