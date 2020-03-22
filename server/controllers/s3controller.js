const dotenv = require('dotenv').config()
const { uuid } = require('uuidv4')
const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-northeast-1' })

const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

const getUploadUrl = async (userId, doggoImageType) => {
	const fileExtension = doggoImageType.split('/')[1]
	const key = `${userId}/${uuid()}.${fileExtension}`

	try {
		const url = await new Promise((resolve, reject) => {
			s3.getSignedUrl(
				'putObject',
				{
					Bucket: 'wander-love-images',
					Key: key,
					ContentType: doggoImageType
				},
				(err, url) => {
					if (err) {
						reject(err)
					}
					resolve(url)
				}
			)
		})

		return { key, url }
	} catch (err) {
		console.error('s3 putObject, get signedUrl failed')
		throw err
	}
}

module.exports = {
	getUploadUrl
}
