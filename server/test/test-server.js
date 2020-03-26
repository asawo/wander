const chai = require('chai'),
	should = chai.should(),
	expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('../index.js')
const dbcontroller = require('../controllers/dbcontroller.js')
const s3controller = require('../controllers/s3controller.js')

chai.use(chaiHttp)

describe(`Page load test for "/" endpoint`, function() {
	it('Should return 200 for / GET', done => {
		chai
			.request(server)
			.get('/')
			.end(function(err, res) {
				res.should.have.status(200)
				should.not.exist(err)
				done()
			})
	})

	it(`Should redirect to "/" from "/users/home" if no session exists`, done => {
		chai
			.request(server)
			.get('/users/home')
			.redirects(0)
			.end(function(err, res) {
				res.should.have.status(302)
				res.should.redirectTo('/')
				should.not.exist(err)
				done()
			})
	})
})

describe(`Test for "/signin" endpoint`, function() {
	it('Should return 400 error with invalid user', done => {
		chai
			.request(server)
			.post('/signin')
			.send({
				username: 'test2',
				password: 'test2'
			})
			.end(function(err, res) {
				expect(err).to.be.a('null')
				res.should.have.status(400)
				done()
			})
	})

	it('Should be able to login with test account', done => {
		chai
			.request(server)
			.post('/signin')
			.send({
				username: 'test',
				password: 'test'
			})
			.end(function(err, res) {
				// expect(err).to.be.a('null')
				// location header lacks redirect
				res.should.have.status(301)
				done()
			})
	})
})

describe('DB controller unit tests', function() {
	it('loadAll should return an array of doggo objects', done => {
		dbcontroller
			.loadAll()
			.then(res => {
				res.should.be.a('array')
				done()
			})
			.catch(err => {
				expect(err).to.be.a('null')
			})
	})

	it('createAccount should create a user account', done => {
		const formData = {
			username: 'test1',
			password: 'test1'
		}

		dbcontroller
			.createAccount(formData)
			.then(res => {
				return dbcontroller.userExists(res.formData.username)
			})
			.then(data => {
				data.should.be.a('object')
				done()
			})
			.catch(err => {
				expect(err).to.be.a('null')
			})
	})

	it('userExists should return an existing user', done => {
		dbcontroller
			.userExists('test1')
			.then(res => {
				res.should.be.a('object')
				done()
			})
			.catch(err => {
				expect(err).to.be.a('null')
			})
	})

	it('deleteUser should delete a user', done => {
		dbcontroller
			.userExists('test1')
			.then(account => {
				return dbcontroller.deleteUser(account.userid)
			})
			.then(result => {
				// result should equal null
				return dbcontroller.userExists('test1')
			})
			.then(response => {
				expect(response).to.be.a('null')
				done()
			})
			.catch(err => {
				expect(err).to.be.a('null')
			})
	})

	it('getCredentials should return username and password', done => {
		dbcontroller
			.getCredentials('test')
			.then(res => {
				res.should.be.a('object')
				done()
			})
			.catch(err => {
				expect(err).to.be.a('null')
			})
	})

	it('authenticateUser should authenticate user', done => {
		dbcontroller
			.getCredentials('test')
			.then(user => {
				return dbcontroller.authenticateUser(user, 'test')
			})
			.then(res => {
				res.result.should.be.a('boolean')
				res.result.should.equal(true)
				done()
			})
			.catch(err => {
				expect(err).to.be.a('null')
			})
	})

	it('authenticateUser should reject fake user', done => {
		dbcontroller
			.getCredentials('test')
			.then(user => {
				return dbcontroller.authenticateUser(user, 'wrongPassword')
			})
			.then(res => {
				res.result.should.be.a('boolean')
				res.result.should.equal(false)
				done()
			})
			.catch(err => {
				console.log(err)
				expect(err).to.be.a('null')
			})
	})

	it('addDoggo should add a doggo in the db', done => {
		const doggoData = {
			doggoName: 'test dog',
			description: 'test dog',
			imageUrl: 'test dog',
			userId: 53
		}

		dbcontroller
			.addDoggo(doggoData)
			.then(doggo => {
				return dbcontroller.getDoggo(doggoData.doggoName)
			})
			.then(response => {
				return dbcontroller.deleteDoggo(response.doggoId)
			})
			.then(res => {
				expect(res).to.be.a('null')
				done()
			})
			.catch(err => {
				expect(err).to.be.a('null')
			})
	})

	it('getDoggo should return doggo data', done => {
		dbcontroller
			.getDoggo('test dog')
			.then(doggo => {
				doggo.should.be.a('object')
				doggo.doggoname.should.equal('test dog')
				done()
			})
			.catch(err => {
				console.log(err)
				expect(err).to.be.a('null')
			})
	})

	it('deleteDoggo should delete doggo from db', done => {
		dbcontroller
			.getDoggo('test dog')
			.then(doggoData => {
				return dbcontroller.deleteDoggo(doggoData.doggoid)
			})
			.then(res => {
				expect(res).to.be.a('null')
				done()
			})
			.catch(err => {
				expect(err).to.be.a('null')
			})
	})
})

describe('S3 controller unit tests', function() {
	it('getUploadUrl should return an object with upload key and url', done => {
		s3controller
			.getUploadUrl('20', 'image/jpeg')
			.then(res => {
				res.should.be.a('object')
				done()
			})
			.catch(err => {
				expect(err).to.be.a('null')
			})
	})

	// it('deleteImage should delete an image from the s3 bucket', done => {
	// 	url =
	// 		// 'https://wander-love-images.s3-ap-northeast-1.amazonaws.com/35/fd58706f-6a0e-4e2c-91fb-252c6539b658.png'
	// 		// pass url from getDoggo in from getDoggo
	// 		s3controller
	// 			.deleteImage(url)
	// 			.then(res => {
	// 				console.log('res in test', res)
	// 				done()
	// 			})
	// 			.catch(err => {
	// 				console.log(err)
	// 			})
	// })
})
