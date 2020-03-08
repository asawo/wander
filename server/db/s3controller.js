const dotenv = require('dotenv').config()
if (dotenv.error) {
	throw result.error
}

const iamUser = process.env.iamUser
const iamSecret = process.env.iamSecret
// console.log(['credentials', { iamUser, iamSecret }])

const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-northeast-1' })

s3 = new AWS.S3({ apiVersion: '2006-03-01' })

s3.listBuckets((err, data) => {
	if (err) {
		console.log('Error, ', err)
	} else {
		console.log('Success, ', data.Buckets)
	}
})

const bucketParams = {
	Bucket: 'wander-love-images'
}

s3.listObjects(bucketParams, (err, data) => {
	if (err) {
		console.log('Error, ', err)
	} else {
		console.log('Success, ', data)
	}
})

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
