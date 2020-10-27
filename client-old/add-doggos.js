async function postData(url = '', data = {}) {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		body: JSON.stringify(data)
	})

	const status = response.status
	const res = await response.json()

	return { status: status, response: res }
}

// Change file name
$('input[type="file"]').change(function(e) {
	const fileName = e.target.files[0].name
	$('.custom-file-label').html(fileName)
})

// Add new dog
const newDog = document.querySelector('#newDog')
newDog.addEventListener('submit', e => {
	e.preventDefault()

	const doggoProfile = {
		doggoName: e.target.elements[0].value,
		doggoImage: e.target.elements[1].files[0],
		doggoImageType: e.target.elements[1].files[0].type,
		description: e.target.elements[2].value
	}

	let key = ''

	postData('../users/add-doggos/upload', doggoProfile)
		.then(data => {
			if (data.status === 200) {
				$('.doggo-created').show() // success label for creating doggo
				return data.response
			} else {
				return data.response
			}
		})
		.then(res => {
			key = res.key
			// Upload doggo image here
			return fetch(res.url, {
				method: 'PUT',
				headers: {
					'Content-Type': doggoProfile.doggoImageType
				},
				body: doggoProfile.doggoImage
			})
		})
		.then(result => {
			const data = {
				doggoName: doggoProfile.doggoName,
				description: doggoProfile.description,
				doggoImage: `https://wander-love-images.s3-ap-northeast-1.amazonaws.com/${key}`
			}
			console.log('posting data to DB:', data)
			return postData('../users/add-doggos/db', data)
		})
		.then(success => {
			setTimeout(() => {
				window.location.replace('/users/my-doggos')
			}, 1500)
		})
		.catch(error => console.log({ error }))
})

// Log out
const logOutBtn = document.querySelector('#logOut')

logOutBtn.addEventListener('click', async e => {
	const response = await fetch('/logout')

	if (response.ok) {
		window.location.replace(response.url)
	} else {
		alert('HTTP-Error: ' + response.status)
	}
})
