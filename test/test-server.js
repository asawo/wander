const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server/index.js')
const pgp = require('pg-promise')()
const CONNECTION_STRING =
	process.env.DATABASE_URL || 'postgres://localhost:5432/wander'
const db = pgp(CONNECTION_STRING)

const should = chai.should()

chai.use(chaiHttp)

describe('page load', function() {
	it('Should return 200 for / GET', function(done) {
		chai
			.request(server)
			.get('/')
			.end(function(err, res) {
				res.should.have.status(200)
				done()
			})
	})
})

describe('Check DB', function() {
	it('Connecting to psql db', function(done) {
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
