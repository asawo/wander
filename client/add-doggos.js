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

	const doggoProfile = {
		doggoName: e.target.elements[0].value,
		doggoImage: e.target.elements[1].files[0],
		description: e.target.elements[2].value
	}

	console.log(e.target.elements[1].files[0])

	postData('../users/add-doggos', doggoProfile).then(data => {
		if (data.status === 200) {
			console.log(data)
			$('.doggo-created').show() // success label for creating doggo
		} else {
			// $('.doggo-exists').show() // doggo exists!
		}
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
