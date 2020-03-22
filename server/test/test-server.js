const chai = require('chai'),
	should = chai.should(),
	expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('../index.js')
const pgp = require('pg-promise')()
const CONNECTION_STRING =
	process.env.DATABASE_URL || 'postgres://localhost:5432/wander'
const db = pgp(CONNECTION_STRING)
const dbcontroller = require('../controllers/dbcontroller.js')
const s3controller = require('../controllers/s3controller.js')

chai.use(chaiHttp)

describe('Page load test for /', function() {
	it('Should return 200 for / GET', done => {
		chai
			.request(server)
			.get('/')
			.end(function(err, res) {
				res.should.have.status(200)
				done()
			})
	}),
		it('Should redirect to / from /users/home if no session exists', done => {
			chai
				.request(server)
				.get('/users/home')
				.redirects(0)
				.end(function(err, res) {
					res.should.redirectTo('/')
					done()
				})
		})
})

describe('Test for /signin endpoint', function() {
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
				res.should.have.status(301)
				done()
			})
	})
})

describe('Check DB', function() {
	it('Should connect to psql db', done => {
		db.any('SELECT username FROM users')
			.then(res => {
				res[0].username.should.equal('polly')
				done()
			})
			.catch(e => console.log(e))
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
			.catch(e => console.log(e))
	})

	it('userExists should return a user', done => {
		dbcontroller
			.userExists('test')
			.then(res => {
				res.should.be.a('object')
				done()
			})
			.catch(e => console.log(e))
	})

	it('getCredentials should return username and password', done => {
		dbcontroller
			.getCredentials('test')
			.then(res => {
				res.should.be.a('object')
				done()
			})
			.catch(e => console.log(e))
	})

	it('authenticateUser should authenticate user', done => {
		dbcontroller
			.getCredentials('test')
			.then(user => {
				dbcontroller
					.authenticateUser(user, 'test')
					.then(res => {
						res.should.be.a('boolean')
						res.should.equal(true)
						done()
					})
					.catch(e => console.log(e))
			})
			.catch(e => console.log(e))
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
			.catch(e => console.log(e))
	})
})
