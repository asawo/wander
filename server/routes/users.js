const express = require('express')
const router = express.Router()
const path = require('path')
const db = require('../controllers/dbcontroller.js')
const s3 = require('../controllers/s3controller.js')

router.use('/', (req, res, next) => {
	if (!req.session.user) res.redirect('/')
	next()
})

router.use('/', express.static(path.join(__dirname, '../../client')))

// Serve home.html
router.get('/home', (req, res) => {
	res.sendFile(path.join(__dirname, '../../client/home.html'))
})

// my doggos page
router.get('/my-doggos', (req, res) => {
	res.sendFile(path.join(__dirname, '../../client/my-doggos.html'))
})

router.get('/load-my-doggos', db.loadMyDoggos)

// add doggos page
router.get('/add-doggos', (req, res) => {
	res.sendFile(path.join(__dirname, '../../client/add-doggos.html'))
})

router.post('/add-doggos', (req, res) => {
	// get the upload url from aws s3
	s3.listBucket(req, res)
	// make sure db.addDoggo runs after s3 returns upload url
	db.addDoggo(req, res)
})

module.exports = router
