const db = require('../controllers/dbcontroller.js')
const s3 = require('../controllers/s3controller.js')

const registerUser = (req, res) => {
	const formData = {
		username: req.body.username,
		password: req.body.password
	}

	db.userExists(formData.username)
		.then(user => {
			if (user) {
				res.status(400).json({ Error: `${formData.username} already exists` })
			} else {
				return db.createAccount(formData)
			}
		})
		.then(response => {
			res.status(200).json({ Success: `${response.formData.username} created` })
		})
		.catch(error => {
			console.log('registerUser error: ', error.message)
		})
}

const signIn = (req, res) => {
	const formData = {
		username: req.body.username,
		password: req.body.password
	}
	db.getCredentials(formData.username)
		.then(user => {
			return db.authenticateUser(user, formData.password)
		})
		.then(authenticated => {
			if (authenticated.result === true) {
				createSession(req.session, authenticated.user)
				res
					.status(301)
					.send({ authenticated: true, user: authenticated.user.username })
			} else {
				res.status(400).send({ message: 'Invalid username or password' })
			}
		})
		.catch(error => {
			res.status(500).json({ error: error.message })
			console.log('signIn error: ', error)
		})
}

const createSession = (session, user) => {
	if (session) {
		session.user = {
			userId: user.userid,
			username: user.username
		}
	}
}

const logOut = (req, res) => {
	if (req.session) {
		req.session.destroy(error => {
			if (error) {
				next(error)
			} else {
				res.redirect('/')
			}
		})
	}
}

const loadAllDoggos = (req, res) => {
	db.loadAll()
		.then(allDoggos => {
			res.status(200).send({ doggos: allDoggos })
		})
		.catch(error => {
			res.status(500).send({ error: error.message })
			console.log(error)
		})
}

const getSignedUrl = (req, res) => {
	const doggoImageType = req.body.doggoImageType
	const userId = req.session.user.userId

	s3.getUploadUrl(userId, doggoImageType)
		.then(url => {
			res.send(url)
		})
		.catch(error => {
			res.status(500).send({ error: error.message })
			console.log(error)
		})
}

const addDogToDb = (req, res) => {
	const dogData = {
		userId: req.session.user.userId,
		doggoName: req.body.doggoName,
		imageUrl: req.body.doggoImage,
		description: req.body.description
	}

	db.addDoggo(dogData)
		.then(result => {
			res.status(200).send({ message: 'SUCCESS' })
			console.log(`Added ${dogData.doggoName}!`)
		})
		.catch(error => {
			res.status(500).send({ error: error.message })
			console.log(error)
		})
}

const loadMyDoggos = (req, res) => {
	let userId = req.session.user.userId
	db.loadMyDoggos(userId)
		.then(doggos => {
			res.status(200).send({ doggos: doggos })
		})
		.catch(error => {
			res.status(500).send({ error: error.message })
			console.log(error)
		})
}

const deleteDogFromDb = (req, res) => {
	const doggoName = req.body.doggoName
	let doggoId = ''

	db.getDoggo(doggoName)
		.then(doggo => {
			doggoId.push(doggo.doggo)
			return s3.deleteImage(doggo.imageurl)
		})
		.then(response => {
			return db.deleteDoggo(doggoId)
		})
		.then(result => {
			res.status(200).send({ 'Doggo deleted': `Doggo ID: ${doggoId}` })
		})
		.catch(error => {
			res.status(500).send({ error: error.message })
			console.log(error)
		})
}

module.exports = {
	registerUser,
	createSession,
	signIn,
	logOut,
	loadAllDoggos,
	getSignedUrl,
	addDogToDb,
	loadMyDoggos,
	deleteDogFromDb
}
