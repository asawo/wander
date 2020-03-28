// fetch doggos and display them on the page
const myDoggos = document.querySelector('#myDoggos')

const addDoggos = (doggoName, description, imageurl) => {
	myDoggos.innerHTML += `
	<div class="doggos text-left text-wrap container" style="overflow-wrap: break-word; background-color: #ffffff; max-width: 660px;">
		<div class="mt-5 pt-3 mx-auto">
			<div class="text-right">
				<span class="mt-3 text-center">

					<button type="button" class="btn btn-info editDog">
						Edit <i class="fa fa-edit"></i>
					</button>

					<button type="button" class="btn btn-danger deleteDog">
						Delete <i class="fa fa-trash"></i>
					</button>

				</span>
			</div>
			<img src=${imageurl} class="doggoImage mt-3" alt="Doggo image" width="100%">
			<div class="card-body">
				<h1 class="dogName">${doggoName}</h1>
				<p class="dogDescription">${description}</p>
				<span class="mt-3">
					<a href="#" class="btn btn-primary">Pat</a>
					<a href="#" class="btn btn-secondary">Like</a>
				</span>
			</div>
		</div>
	</div> \n`
}

async function loadDoggos() {
	let response = await fetch('/users/load-my-doggos')
	let resJson = await response.json()

	if (response.ok && resJson.doggos.length > 0) {
		myDoggos.innerHTML = ''
		resJson.doggos.forEach(doggo => {
			addDoggos(doggo.doggoname, doggo.description, doggo.imageurl)
		})
	} else if (response.ok && resJson.doggos.length === 0) {
		console.log('HTTP-status: ' + response.status + ' but no data')
	} else {
		alert('HTTP-Error: ' + response.status)
	}
}

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

const deleteModalBody = document.querySelector('.deleteModalBody')

const deleteRequest = async (data = {}) => {
	const response = await fetch('/users/delete-doggo', {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'DELETE',
		body: JSON.stringify(data)
	})

	let status = response.status
	let res = await response.json()

	return { status, res }
}

loadDoggos()
	.then(result => {
		// Add event listener on every doggo card's edit button
		const editDoggo = document.querySelectorAll('.editDog')

		editDoggo.forEach(doggo =>
			doggo.addEventListener('click', async e => {
				const doggoName =
					e.target.parentElement.parentElement.nextElementSibling
						.nextElementSibling.firstElementChild.innerText

				// let response = await fetch('/edit-doggo')
				$('#editDog').modal('toggle')
				// Put request for editing doggo
			})
		)

		// Add event listener on every doggo card's delete button
		const deleteDoggo = document.querySelectorAll('.deleteDog')

		deleteDoggo.forEach(doggo => {
			doggo.addEventListener('click', async e => {
				const doggoName =
					e.srcElement.parentNode.parentElement.nextElementSibling
						.nextElementSibling.firstElementChild.innerText

				// Insert doggo name into modal before toggling
				deleteModalBody.innerHTML = `<p>Are you sure to delete  <span class="doggoName">${doggoName}</span> permanently?</p>`

				$('#deleteDog').modal('toggle')
				// delete dog request
			})
		})
	})
	.catch(error => console.log('Error: ', error))

// Confirm delete button
const confirmDelete = document.querySelectorAll('#confirmDelete')

confirmDelete.forEach(button => {
	button.addEventListener('click', async e => {
		const doggoName = document.querySelector('.doggoName').innerHTML

		data = { doggoName }
		deleteRequest(data)
			.then(res => {
				document.querySelector('.doggo-delete-success').style.display = 'block'

				setTimeout(() => {
					location.reload()
				}, 1500)
				console.log(res)
			})
			.catch(error => {
				alert(error)
				console.log({ error })
			})
	})
})
