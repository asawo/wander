async function postData(url = '', data = {}) {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		body: JSON.stringify(data)
	})

	let status = response.status
	let res = await response.json()

	return { status: status, response: res }
}

// Change file name
$('input[type="file"]').change(function(e) {
	var fileName = e.target.files[0].name
	$('.custom-file-label').html(fileName)
})

// Add new dog
const newDog = document.querySelector('#newDog')
newDog.addEventListener('submit', e => {
	e.preventDefault()

	let doggoProfile = {
		doggoName: e.target.elements[0].value,
		doggoImage: e.target.elements[1].files[0], //Undefined on server
		doggoImageType: e.target.elements[1].files[0].type,
		description: e.target.elements[2].value
	}

	postData('../users/add-doggos/upload', doggoProfile)
		.then(data => {
			if (data.status === 200) {
				$('.doggo-created').show() // success label for creating doggo
				return data.response
			} else {
				// $('.doggo-exists').show() // doggo exists!
				return data.response
			}
		})
		.then(res => {
			// console.log('res ', res)
			// console.log('doggoProfile ', doggoProfile)
			// Upload doggo image here
			fetch(res.url, {
				method: 'PUT',
				headers: {
					'Content-Type': doggoProfile.doggoImageType
				},
				body: doggoProfile.doggoImage
			}).then(result => {
				const data = {
					doggoName: doggoProfile.doggoName,
					description: doggoProfile.description,
					doggoImage: `https://wander-love-images.s3-ap-northeast-1.amazonaws.com/${res.key}`
				}
				console.log('posting this data to DB:', data)
				postData('../users/add-doggos/db', data)
					.then(res => console.log(res))
					.catch(error => console.error('Error:', error))
			})
		})
})

// Log out
const logOutBtn = document.querySelector('#logOut')

logOutBtn.addEventListener('click', async e => {
	let response = await fetch('/logout')

	if (response.ok) {
		window.location.replace(response.url)
	} else {
		alert('HTTP-Error: ' + response.status)
	}
})
