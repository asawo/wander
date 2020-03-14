const dotenv = require('dotenv').config()
const { uuid } = require('uuidv4')
const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-northeast-1' })

const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

const bucketParams = {
	Bucket: 'wander-love-images',
	Key: '',
	ContentType: ''
}

const getUrl = (req, res) => {
	let userId = req.session.user.userId
	let doggoName = req.body.doggoName
	let doggoImage = req.body.doggoImage.name
	let description = req.body.description
	console.log('req.body ', req.body)
	const key = `${userId}/${uuid()}.png`

	s3.getSignedUrl(
		'putObject',
		{
			Bucket: 'wander-love-images',
			Key: key,
			ContentType: 'png'
		},
		(err, url) => {
			console.log({ key, url })
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

// const BUCKET_NAME = ''
// const IAM_USER_KEY = ''
// const IAM_USER_SECRET = ''

// function uploadToS3(file) {
// 	let s3bucket = new AWS.S3({
// 		accessKeyId: IAM_USER_KEY,
// 		secretAccessKey: IAM_USER_SECRET,
// 		Bucket: BUCKET_NAME
// 	})

// 	s3bucket.createBucket(function() {
// 		var params = {
// 			Bucket: BUCKET_NAME,
// 			Key: file.name,
// 			Body: file.data
// 		}
// 		s3bucket.upload(params, function(err, data) {
// 			if (err) {
// 				console.log('error in callback')
// 				console.log(err)
// 			}
// 			console.log('success')
// 			console.log(data)
// 		})
// 	})
// }
