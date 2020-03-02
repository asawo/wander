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

// fetch doggos and display them on the page
const myDoggos = document.querySelector('#myDoggos')

const addDoggos = (doggoName, description) => {
	myDoggos.innerHTML += `<div class="doggos"><h5>Doggo name: ${doggoName}. Description: ${description}.</h5></div> \n`
}

async function loadDoggos() {
	let response = await fetch('/users/load-my-doggos')
	let resJson = await response.json()

	if (response.ok && resJson.doggos.length > 0) {
		myDoggos.innerHTML = ''
		resJson.doggos.forEach(doggo => {
			addDoggos(doggo.doggoname, doggo.description)
		})
	} else if (response.ok && resJson.doggos.length === 0) {
		console.log('HTTP-status: ' + response.status + ' but no data')
	} else {
		alert('HTTP-Error: ' + response.status)
	}
}

loadDoggos()
