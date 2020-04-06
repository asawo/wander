const chai = require('chai'),
	should = chai.should(),
	expect = chai.expect

chai.use(require('chai-as-promised'))
const chaiHttp = require('chai-http')
const sinon = require('sinon')
const server = require('../index.js')
const dbcontroller = require('../controllers/dbcontroller.js')
const s3controller = require('../controllers/s3controller.js')

chai.use(chaiHttp)

describe(`Page load test for "/" endpoint`, function () {
	it('Should return 200 for / GET', (done) => {
		chai
			.request(server)
			.get('/')
			.end(function (err, res) {
				res.should.have.status(200)
				should.not.exist(err)
				done()
			})
	})

	it(`Should redirect to "/" from "/users/home" if no session exists`, (done) => {
		chai
			.request(server)
			.get('/users/home')
			.redirects(0)
			.end(function (err, res) {
				res.should.have.status(302)
				res.should.redirectTo('/')
				should.not.exist(err)
				done()
			})
	})
})

describe(`Test for "/signin" endpoint`, function () {
	it('Should return 400 error with invalid user', (done) => {
		chai
			.request(server)
			.post('/signin')
			.send({
				username: 'test2',
				password: 'test2',
			})
			.end(function (err, res) {
				expect(err).to.be.a('null')
				res.should.have.status(400)
				done()
			})
	})

	it('Should be able to login with test account', (done) => {
		chai
			.request(server)
			.post('/signin')
			.send({
				username: 'test',
				password: 'test',
			})
			.end(function (err, res) {
				// expect(err).to.be.a('null')
				// location header lacks redirect
				res.should.have.status(301)
				done()
			})
	})
})

describe('DB controller', () => {
	afterEach(() => {
		sinon.restore()
	})

	it('loadAll should return an array of doggo objects', (done) => {
		dbcontroller
			.loadAll()
			.then((res) => {
				res.should.be.a('array')
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('createAccount should create a user account', (done) => {
		const objectStub = {
			result: null,
			formData: { username: 'test1', password: 'test1' },
		}

		const bcryptStub = sinon.stub(dbcontroller.bcrypt, 'hash').resolves('hi')

		const noneStub = sinon.stub(dbcontroller.db, 'none').resolves(objectStub)

		dbcontroller
			.createAccount(objectStub.formData)
			.then((res) => {
				res.should.be.a('object')
				res.result.should.equal(objectStub)
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('userExists should return an existing user', (done) => {
		const userObject = { userid: 10 }

		const oneOrNoneStub = sinon
			.stub(dbcontroller.db, 'oneOrNone')
			.resolves(userObject)

		dbcontroller
			.userExists('test1')
			.then((res) => {
				res.should.be.a('object')
				res.should.equal(userObject)
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('deleteUser should delete a user', (done) => {
		const oneOrNoneStub = sinon
			.stub(dbcontroller.db, 'oneOrNone')
			.resolves(null)

		dbcontroller
			.deleteUser('fakeUser')
			.then((result) => {
				expect(result).to.be.a('null')
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('getCredentials should return username and password', (done) => {
		const userCredStub = {
			userid: 1,
			username: 'fakeUsername',
			password: 'fakePassword',
		}
		const oneOrNoneStub = sinon
			.stub(dbcontroller.db, 'oneOrNone')
			.resolves(userCredStub)

		dbcontroller
			.getCredentials()
			.then((res) => {
				res.should.be.a('object')
				res.should.equal(userCredStub)
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('authenticateUser should authenticate user', (done) => {
		const bcryptStub = sinon.stub(dbcontroller.bcrypt, 'compare').resolves(true)

		dbcontroller
			.authenticateUser('fakeUser', 'test')
			.then((res) => {
				res.should.be.a('object')
				res.result.should.be.a('boolean')
				res.result.should.equal(true)
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('authenticateUser should reject fake user', (done) => {
		const bcryptStub = sinon
			.stub(dbcontroller.bcrypt, 'compare')
			.resolves(false)

		dbcontroller
			.authenticateUser('fakeUser', 'wrongPassword')
			.then((res) => {
				res.should.be.a('object')
				res.result.should.be.a('boolean')
				res.result.should.equal(false)
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('addDoggo should add a doggo in the db', (done) => {
		const doggoData = {
			doggoName: 'test dog',
			description: 'test dog',
			imageUrl: 'test dog',
			userId: 53,
		}

		dbcontroller
			.addDoggo(doggoData)
			.then((doggo) => {
				return dbcontroller.getDoggo(doggoData.doggoName)
			})
			.then((response) => {
				return dbcontroller.deleteDoggo(response.doggoId)
			})
			.then((res) => {
				expect(res).to.be.a('null')
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})

	it('getDoggo should return doggo data', (done) => {
		dbcontroller
			.getDoggo('test dog')
			.then((doggo) => {
				doggo.should.be.a('object')
				doggo.doggoname.should.equal('test dog')
				done()
			})
			.catch((err) => {
				console.log(err)
				expect(err).to.be.a('null')
			})
	})

	it('updateDoggo should return updated doggo data', (done) => {
		let doggoId = ''
		const newDogName = 'test dog 2.0'
		const newDogDesc = 'updated test doggo'

		dbcontroller
			.getDoggo('test dog')
			.then((doggo) => {
				doggoId = doggo.doggoid

				return dbcontroller.updateDoggo(doggoId, newDogName, newDogDesc)
			})
			.then((res) => {
				res[0].doggoname.should.equal(newDogName)
				res[0].description.should.equal(newDogDesc)
				res.should.be.a('array')
				done()
			})
			.catch((err) => {
				console.log(err)
				expect(err).to.be.a('null')
			})
	})

	it('deleteDoggo should delete doggo from db', (done) => {
		dbcontroller
			.getDoggo('test dog 2.0')
			.then((doggoData) => {
				return dbcontroller.deleteDoggo(doggoData.doggoid)
			})
			.then((res) => {
				expect(res).to.be.a('null')
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})
})

describe('S3 controller unit tests', function () {
	it('getUploadUrl should return an object with upload key and url', (done) => {
		s3controller
			.getUploadUrl('20', 'image/jpeg')
			.then((res) => {
				res.should.be.a('object')
				done()
			})
			.catch((err) => {
				expect(err).to.be.a('null')
			})
	})
})
