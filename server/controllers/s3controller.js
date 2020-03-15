const dotenv = require('dotenv').config()
const { uuid } = require('uuidv4')
const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-northeast-1' })

const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

// Get secure signed URL from AWS to send PUT request to
const getUrl = (req, res) => {
	const userId = req.session.user.userId
	const doggoImageType = req.body.doggoImageType
	const key = `${userId}/${uuid()}.png`

	s3.getSignedUrl(
		'putObject',
		{
			Bucket: 'wander-love-images',
			Key: key,
			ContentType: doggoImageType
		},
		(err, url) => {
			if (err) {
				console.log('Error: ', err)
			}
			res.send({ key, url })
		}
	)
}

// Function exporting just to check
const listBucketAndObjects = () => {
	s3.listBuckets((err, data) => {
		if (err) {
			console.log('Error, ', err)
		} else {
			console.log('Success, bucket here: ', data.Buckets)
		}
	})

	const bucketParams = {
		Bucket: 'wander-love-images'
	}

	s3.listObjects(bucketParams, (err, data) => {
		if (err) {
			console.log('Error, ', err)
		} else {
			console.log('Success, objects here: ', data.Contents)
		}
	})
}

module.exports = {
	listBucket: listBucketAndObjects,
	getUrl: getUrl
}
