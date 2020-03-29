const timeline = document.querySelector('#timeline')

const addDoggos = (doggoName, description, imageurl, username) => {
	timeline.innerHTML += `
	<div class="doggos text-left text-wrap container" style="overflow-wrap: break-word; background-color: #ffffff; max-width: 660px;">
		<div class="mt-5 mx-auto">
			<img src=${imageurl} class="pt-3" alt="Doggo image" width="100%">
			<div class="card-body">
				<h1 class="dogName">${doggoName}</h1>
				<p class="dogDescription">${description}</p>
				<p class="font-italic text-muted">Added by ${username}</p>
				<span class="mt-3">
					<a href="#" class="btn btn-dark">Pat 👋</a>
					<a href="#" class="btn btn-secondary">Like <i class="fa fa-heart"></i></a>
				</span>
			</div>
		</div>
	</div> \n`
}

async function loadDoggos() {
	const response = await fetch('/all-doggos')
	const resJson = await response.json()
	console.log(resJson)

	if (response.ok && resJson.doggos.length > 0) {
		timeline.innerHTML = ''
		resJson.doggos.forEach(doggo => {
			addDoggos(
				doggo.doggoname,
				doggo.description,
				doggo.imageurl,
				doggo.username
			)
		})
	} else if (response.ok && resJson.doggos.length === 0) {
		console.log('HTTP-status: ' + response.status + ' but no data')
	} else {
		alert('HTTP-Error: ' + response.status)
	}
}

loadDoggos()

const logOutBtn = document.querySelector('#logOut')

logOutBtn.addEventListener('click', async e => {
	const response = await fetch('/logout')

	if (response.ok) {
		window.location.replace(response.url)
	} else {
		alert('HTTP-Error: ' + response.status)
	}
})
