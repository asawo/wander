var chai = require('chai')
var chaiHttp = require('chai-http')
var server = require('../server/index.js')
var should = chai.should()

chai.use(chaiHttp)

describe('page load', function() {
	it('should return 200 for / GET', function(done) {
		chai
			.request(server)
			.get('/')
			.end(function(err, res) {
				res.should.have.status(200)
				done()
			})
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
