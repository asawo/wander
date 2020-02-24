const express = require('express')
const router = express.Router()
const path = require('path')
// const bodyParser = require('body-parser')

// to handle uploads
// const Busboy = require('busboy')
// const busboy = require('connect-busboy')
// const busboyBodyParser = require('busboy-body-parser')
// router.use(busboy())
// router.use(bodyParser.urlencoded({ extended: true }))
// router.use(bodyParser.json())
// router.use(busboyBodyParser())

router.use('/', express.static(path.join(__dirname, '../client')))

router.get('/home', (req, res) => {
	if (req.session.user) {
		res.sendFile(path.join(__dirname, '../client/home.html'))
	} else {
		res.redirect('/')
	}
})

// add doggos
router.get('/add-doggos', (req, res) => {
	if (req.session.user) {
		res.sendFile(path.join(__dirname, '../client/add-doggos.html'))
	} else {
		res.redirect('/')
	}
})

router.post('/add-doggos', (req, res) => {
	let userId = req.session.user.userId
	let doggoName = req.body.doggoName
	let description = req.body.description
	// let doggoImage = req.body.doggoImage

	db.none(
		'INSERT INTO doggos(doggoname, description, userid) VALUES($1,$2,$3)',
		[doggoName, description, userId]
	).then(() => {
		res.status(200).send({ message: 'SUCCESS' })
	})
})

router.post('/add-doggos', (req, res) => {
	let username = req.session.username
	let doggoName = req.body.doggoName
	// let doggoImage = req.body.doggoImage
	let description = req.body.description

	res.status(200).send({
		username: username,
		doggoName: doggoName,
		// doggoImage: req.body.doggoImage,
		description: description
	})
})

// upload image
// router.post('/add-doggos/upload', (req, res, next) => {
// 	// This grabs the additional parameters so in this case passing
// 	// in "element1" with a value.
// 	const doggoImage = req.body.doggoImage
// 	var busboy = new Busboy({ headers: req.headers })
// 	// The file upload has completed
// 	busboy.on('finish', () => {
// 		console.log('Upload finished')
// 		// Your files are stored in req.files. In this case,
// 		// you only have one and it's req.files.element2:
// 		// This returns:
// 		// {c
// 		//    element2: {
// 		//      data: ...contents of the file...,
// 		//      name: 'Example.jpg',
// 		//      encoding: '7bit',
// 		//      mimetype: 'image/png',
// 		//      truncated: false,
// 		//      size: 959480
// 		//    }
// 		// }
// 		// Grabs your file object from the request.
// 		const file = req.files.doggoImageUploaded
// 		console.log(file)
// 	})
// 	req.pipe(busboy)
// })

module.exports = router
