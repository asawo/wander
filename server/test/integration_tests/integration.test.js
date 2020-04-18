const chai = require('chai'),
	should = chai.should(),
	expect = chai.expect

chai.use(require('chai-as-promised'))
const chaiHttp = require('chai-http')
const sinon = require('sinon')
const dbcontroller = require('../../controllers/dbcontroller.js')
const s3controller = require('../../controllers/s3controller.js')
const server = require('../../index.js')

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
})

describe('S3 controller connection tests', function () {
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

	it('deleteImage with invalid url should return an object with upload key and url', (done) => {
		const url = 'www.aws.s3/asfasd'

		s3controller
			.deleteImage(url)
			.then((res) => {})
			.catch((err) => {
				expect(err.message).to.equal(
					'Expected uri parameter to have length >= 1, but found "" for params.Key'
				)
				done()
			})
	})
})
