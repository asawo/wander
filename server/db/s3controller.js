const dotenv = require('dotenv').config()
if (dotenv.error) {
	throw result.error
}

const iamUser = process.env.iamUser
const iamSecret = process.env.iamSecret

console.log(iamUser, iamSecret)
