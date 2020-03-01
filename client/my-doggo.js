const logOutBtn = document.querySelector('#logOut')

logOutBtn.addEventListener('click', async e => {
	let response = await fetch('/logout')
	console.log(response)

	if (response.ok) {
		window.location.replace(response.url)
	} else {
		alert('HTTP-Error: ' + response.status)
	}
})

const myDoggos = document.querySelector('#myDoggos')

const addItems = (doggoName, description) => {
	myDoggos.append('<div class="doggos">' + doggoName + description + '</div>')
}

async function loadDoggos() {
	let response = await fetch('/users/load-my-doggos')
	console.log('response: ', response)
	if (response.ok) {
		let resJson = await response.json()
		console.log('response.json: ', resJson.doggos)
	} else {
		alert('HTTP-Error: ' + response.status)
	}
}

loadDoggos()
