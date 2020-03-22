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
				username: 'test1',
				password: 'test1'
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

describe('DB controller functions', function() {
	it('loadAll should return an array of objects', done => {
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

	it('userExists should return a user', done => {
		dbcontroller
			.userExists('test')
			.then(res => {
				res.should.be.a('object')
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
})

describe('S3 controller functions', function() {
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
})
