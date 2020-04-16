const chai = require('chai'),
	should = chai.should(),
	expect = chai.expect

const chaiHttp = require('chai-http')
chai.use(chaiHttp)
chai.use(require('chai-as-promised'))
const sinon = require('sinon')
const functionsjs = require('../routes/functions')

describe(`functions.js unit tests`, function () {
	let status, send, res

	beforeEach(() => {
		status = sinon.stub()
		send = sinon.spy()
		res = { send, status }
		status.returns(res)
	})

	afterEach(() => {
		sinon.restore()
	})

	it('registerUseroh should register user, send back status 200', async () => {
		const req = {
			body: {
				username: 'mockUsername',
				password: 'mockPassword',
			},
		}

		const userExistsStub = sinon
			.stub(functionsjs.dbcontroller, 'userExists')
			.resolves(null)
		const createAccountStub = sinon
			.stub(functionsjs.dbcontroller, 'createAccount')
			.resolves(null)

		await functionsjs.registerUser(req, res)
		expect(status.calledOnce).to.be.true
		expect(status.args[0][0]).to.equal(200)
		expect(send.calledOnce).to.be.true
		expect(send.args[0][0]).to.deep.equal({
			Success: `${req.body.username} created`,
		})
	})

	it('registerUser should detect pre-exisiting user, send back status 400 and a "user already exists" message', async () => {
		const req = {
			body: {
				username: 'mockUsername',
				password: 'mockPassword',
			},
		}

		const userExistsStub = sinon
			.stub(functionsjs.dbcontroller, 'userExists')
			.resolves(1)

		await functionsjs.registerUser(req, res)
		expect(status.calledOnce).to.be.true
		expect(status.args[0][0]).to.equal(400)
		expect(send.calledOnce).to.be.true
		expect(send.args[0][0]).to.deep.equal({
			Error: `${req.body.username} already exists`,
		})
		// console.log(status.args[0][0], send.args[0][0])
	})

	it('signIn should authenticate user, send back status 301', async () => {
		let req = {
			body: {
				username: 'mockUsername',
				password: 'mockPassword',
			},
		}

		const getCredentialsStub = sinon
			.stub(functionsjs.dbcontroller, 'getCredentials')
			.resolves({
				userid: 1,
				username: 'mockUsername',
				password: 'mockPassword',
			})
		const authenticateUserStub = sinon
			.stub(functionsjs.dbcontroller, 'authenticateUser')
			.resolves({
				result: true,
				user: { username: 'mockUsername', password: 'mockPassword' },
			})

		await functionsjs.signIn(req, res)
		expect(status.calledOnce).to.be.true
		expect(status.args[0][0]).to.equal(301)
		expect(send.calledOnce).to.be.true
		expect(send.args[0][0]).to.deep.equal({
			authenticated: true,
			user: 'mockUsername',
		})
		// console.log(status.args[0][0], send.args[0][0])
	})

	it('signIn should reject invalid password, send back status 400', async () => {
		let req = {
			body: {
				username: 'mockUsername',
				password: 'mockPassword',
			},
		}

		const getCredentialsStub = sinon
			.stub(functionsjs.dbcontroller, 'getCredentials')
			.resolves({
				userid: 1,
				username: 'mockUsername',
				password: 'mockPassword',
			})
		const authenticateUserStub = sinon
			.stub(functionsjs.dbcontroller, 'authenticateUser')
			.resolves(false)

		await functionsjs.signIn(req, res)
		expect(status.calledOnce).to.be.true
		expect(status.args[0][0]).to.equal(400)
		expect(send.calledOnce).to.be.true
		expect(send.args[0][0]).to.deep.equal({
			message: 'Invalid username or password',
		})
		// console.log(status.args[0][0], send.args[0][0])
	})

	it('loadAllDoggos should return an object of doggos', async () => {
		let req

		const doggoStub = [
			{
				doggoid: 111,
				doggoname: 'Japanese Doggo',
				imageurl: 'https://stuburl.com/stubbyboi.jpeg',
				description: 'Konbanwan 🐕',
				username: 'hi',
				likestotal: '3',
			},
			{
				doggoid: 33,
				doggoname: 'Huskyboi',
				imageurl: 'https://stuburl.com/stubbyboi.jpeg',
				description: 'Winter is coming ❄️',
				username: 'hi',
				likestotal: '2',
			},
		]

		const loadAllStub = sinon
			.stub(functionsjs.dbcontroller, 'loadAll')
			.resolves(doggoStub)

		await functionsjs.loadAllDoggos(req, res)
		expect(status.calledOnce).to.be.true
		expect(status.args[0][0]).to.equal(200)
		expect(send.calledOnce).to.be.true
		expect(send.args[0][0]).to.deep.equal({ doggos: doggoStub })
		// console.log(status.args[0][0], send.args[0][0])
	})

	it('getSignedUrl should return a secure url', async () => {
		const reqStub = {
			body: {
				doggoImageType: 'jpg',
			},
			session: {
				user: { userId: 5 },
			},
		}

		let req = reqStub

		const urlStub = 'http://www.stubbysecureurl.com'

		const getUploadUrlStub = sinon
			.stub(functionsjs.s3controller, 'getUploadUrl')
			.resolves(urlStub)

		await functionsjs.getSignedUrl(req, res)
		expect(status.calledOnce).to.be.true
		expect(status.args[0][0]).to.equal(200)
		expect(send.calledOnce).to.be.true
		expect(send.args[0][0]).to.equal(urlStub)
		// console.log(status.args[0][0], send.args[0][0])
	})

	it('addDogToDb should add dog to DB and return status 200 with success message ', async () => {
		const req = {
			body: {
				doggoName: 'stubby',
				imageUrl: 'stubby.com',
				description: 'very stubby around the middle',
			},
			session: {
				user: { userId: 5, username: 'userStub' },
			},
		}

		const addDoggoStub = sinon
			.stub(functionsjs.dbcontroller, 'addDoggo')
			.resolves('Dog added')

		await functionsjs.addDogToDb(req, res)
		expect(status.calledOnce).to.be.true
		expect(status.args[0][0]).to.equal(200)
		expect(send.calledOnce).to.be.true
		expect(send.args[0][0]).to.deep.equal({ message: 'SUCCESS' })
		// console.log(status.args[0][0], send.args[0][0])
	})

	it('loadMyDoggos should return status 200 with doggo objects', async () => {
		const req = {
			session: {
				user: { userId: 5 },
			},
		}

		const doggosStub = { doggo: 'doggo' }

		const loadMyDoggosStub = sinon
			.stub(functionsjs.dbcontroller, 'loadMyDoggos')
			.resolves(doggosStub)

		await functionsjs.loadMyDoggos(req, res)
		expect(status.calledOnce).to.be.true
		expect(status.args[0][0]).to.equal(200)
		expect(send.calledOnce).to.be.true
		expect(send.args[0][0]).to.deep.equal({ doggos: doggosStub })
		// console.log(status.args[0][0], send.args[0][0])
	})

	it('likeDog should return status 200 and like doggo', async () => {
		const req = {
			session: {
				user: { userId: 5 },
			},
			body: { doggoId: 5 },
		}

		const doggoStub = { doggoId: 5, userId: 5, dateliked: 'dateStub' }

		const likeDoggoStub = sinon
			.stub(functionsjs.dbcontroller, 'likeDoggo')
			.resolves(doggoStub)

		await functionsjs.likeDog(req, res)
		expect(status.calledOnce).to.be.true
		expect(status.args[0][0]).to.equal(200)
		expect(send.calledOnce).to.be.true
		expect(send.args[0][0]).to.deep.equal(doggoStub)
		// console.log(status.args[0][0], send.args[0][0])
	})

	it('unlikeDog should return status 200 and unlike doggo', async () => {
		const req = {
			session: {
				user: { userId: 5 },
			},
			body: { doggoId: 5 },
		}

		const doggoStub = { doggoId: 5, userId: 5, dateliked: 'dateStub' }

		const unlikeDoggoStub = sinon
			.stub(functionsjs.dbcontroller, 'unlikeDoggo')
			.resolves(doggoStub)

		await functionsjs.unlikeDog(req, res)
		expect(status.calledOnce).to.be.true
		expect(status.args[0][0]).to.equal(200)
		expect(send.calledOnce).to.be.true
		expect(send.args[0][0]).to.deep.equal(doggoStub)
		// console.log(status.args[0][0], send.args[0][0])
	})

	it('checkIfLiked should return status 200 and true if user already liked the dog', async () => {
		const req = {
			session: {
				user: { userId: 5 },
			},
			params: { id: 5 },
		}

		const checkIfLikedStub = sinon
			.stub(functionsjs.dbcontroller, 'checkIfLiked')
			.resolves(null)

		await functionsjs.checkIfLiked(req, res)
		expect(status.calledOnce).to.be.true
		expect(status.args[0][0]).to.equal(200)
		expect(send.calledOnce).to.be.true
		expect(send.args[0][0]).to.deep.equal(false)
		// console.log(status.args[0][0], send.args[0][0])
	})

	it('checkIfLiked should return status 200 and false if user has yet to like the dog', async () => {
		const req = {
			session: {
				user: { userId: 5 },
			},
			params: { id: 5 },
		}

		const checkIfLikedStub = sinon
			.stub(functionsjs.dbcontroller, 'checkIfLiked')
			.resolves('record of user liking dog')

		await functionsjs.checkIfLiked(req, res)
		expect(status.calledOnce).to.be.true
		expect(status.args[0][0]).to.equal(200)
		expect(send.calledOnce).to.be.true
		expect(send.args[0][0]).to.deep.equal(true)
		// console.log(status.args[0][0], send.args[0][0])
	})

	it('updateDog should send back 200 and return updated dog data', async () => {
		const req = {
			body: {
				doggoName: 'Japanese Doggo',
				newDogName: 'Japanese Doggo',
				newDogDesc: 'Konbanwan 🐕',
			},
			session: {
				user: { userId: 5 },
			},
		}

		const doggoStub = {
			doggoid: 111,
			doggoname: 'Japanese Doggo',
			description: 'Konbanwan 🐕',
		}

		const getDoggoStub = sinon
			.stub(functionsjs.dbcontroller, 'getDoggo')
			.resolves(doggoStub)
		const updateDogStub = sinon
			.stub(functionsjs.dbcontroller, 'updateDoggo')
			.resolves(doggoStub)

		await functionsjs.updateDog(req, res)
		expect(status.calledOnce).to.be.true
		expect(status.args[0][0]).to.equal(200)
		expect(send.calledOnce).to.be.true
		expect(send.args[0][0]).to.deep.equal(doggoStub)
		// console.log(status.args[0][0], send.args[0][0])
	})

	it('deleteDogFromDb should delete dog and return 200', async () => {
		const req = {
			session: {
				user: { userId: 5 },
			},
			body: { doggoName: 'Stubby dog' },
		}

		const doggoStub = {
			doggoid: 111,
			doggoname: 'Japanese Doggo',
			imageurl: 'https://stuburl.com/stubbyboi.jpeg',
			description: 'Konbanwan 🐕',
			username: 'hi',
			likestotal: '3',
		}

		const getDoggoStub = sinon
			.stub(functionsjs.dbcontroller, 'getDoggo')
			.resolves(doggoStub)

		const deleteImageStub = sinon
			.stub(functionsjs.s3controller, 'deleteImage')
			.resolves('stub')

		const deleteDoggoStub = sinon
			.stub(functionsjs.dbcontroller, 'deleteDoggo')
			.resolves('stub')

		await functionsjs.deleteDogFromDb(req, res)
		expect(status.calledOnce).to.be.true
		expect(status.args[0][0]).to.equal(200)
		expect(send.calledOnce).to.be.true
		expect(send.args[0][0]).to.deep.equal({
			'Doggo deleted': `Doggo ID: ${doggoStub.doggoid}`,
		})
		// console.log(status.args[0][0], send.args[0][0])
	})
})
