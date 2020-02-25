const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server/index')
const pgp = require('pg-promise')()
const CONNECTION_STRING =
	process.env.DATABASE_URL || 'postgres://localhost:5432/wander'
const db = pgp(CONNECTION_STRING)

const should = chai.should()

chai.use(chaiHttp)

describe('Check page load', function() {
	it('Should return 200 for / GET', done => {
		chai
			.request(server)
			.get('/')
			.end(function(err, res) {
				res.should.have.status(200)
				done()
			})
	}),
		it('Should redirect to / for /users/home GET', done => {
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

describe('Check login', function() {
	it('Should return 400 error with invalid user', done => {
		chai
			.request(server)
			.post('/signin')
			.send({
				username: 'test1',
				password: 'test1'
			})
			.end(function(err, res) {
				res.should.have.status(400)
				done()
			})
	})
})

describe('Check DB', function() {
	// before(function(done){
	//   ...
	// });
	// after(function(done){
	//   ...
	// });
	it('Should connect to psql db', done => {
		db.any('SELECT username FROM users')
			.then(res => {
				res[0].username.should.equal('polly')
				done()
			})
			.catch(e => console.log(e))
	})
})

// describe('user registration', function() {
// 	it('should return error if registering existing username', function(done) {
// 		chai
// 			.request(server)
// 			.post('/signup')
// 			.end(function(err, res) {
// 				res.should.have.status(300)
// 				done()
// 			})
// 	})
// })
