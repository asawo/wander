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

	it('registerUser() should register user, send back status 200', async () => {
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

	it('registerUser() should detect pre-exisiting user, send back status 400 and a "user already exists" message', async () => {
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

	it('signIn() should authenticate user, send back status 301', async () => {
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

	it('signIn() should reject invalid password, send back status 400', async () => {
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
})
