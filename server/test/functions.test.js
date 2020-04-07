const chai = require('chai'),
	should = chai.should(),
	expect = chai.expect

const chaiHttp = require('chai-http')
chai.use(chaiHttp)
chai.use(require('chai-as-promised'))
const sinon = require('sinon')
const functionsjs = require('../routes/functions')

describe(`functions.js registerUser`, function () {
	it('should register user, send back status 200', async (done) => {
		// const mReq = {
		// 	body: {
		// 		username: 'mockUsername',
		// 		password: 'mockPassword',
		// 	},
		// }
		// const mRes = {
		// 	status: sinon.stub(),
		// 	send: sinon.stub(),
		// }
		// const userExistsStub = sinon
		// 	.stub(functionsjs.dbcontroller, 'userExists')
		// 	.resolves(1)
		// const createAccountStub = sinon
		// 	.stub(functionsjs.dbcontroller, 'createAccount')
		// 	.resolves(null)
		// const result = await functionsjs.registerUser(mReq, mRes)
		// console.log({ result })
		done()
	})
})
