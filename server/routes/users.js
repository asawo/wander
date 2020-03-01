const express = require('express')
const router = express.Router()
const path = require('path')
const db = require('../db/dbcontroller.js')

router.use('/', express.static(path.join(__dirname, '../../client')))

router.use('/', (req, res, next) => {
	if (!req.session.user) res.redirect('/')
	next() // causing "can't set headers after they are sent" error
})

// Serve home.html, or redirect to / if no session
router.get('/home', (req, res) => {
	res.sendFile(path.join(__dirname, '../../client/home.html'))
})

// my doggos page
router.get('/my-doggos', (req, res) => {
	res.sendFile(path.join(__dirname, '../../client/my-doggos.html'))
})

// add doggos page
router.get('/add-doggos', (req, res) => {
	res.sendFile(path.join(__dirname, '../../client/add-doggos.html'))
})

router.post('/add-doggos', db.addDoggo)

module.exports = router
