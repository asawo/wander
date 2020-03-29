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
			</div>
		</div>
	</div> \n`
}

async function loadDoggos() {
	const response = await fetch('/users/load-my-doggos')
	const resJson = await response.json()

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
	const response = await fetch('/logout')

	if (response.ok) {
		window.location.replace(response.url)
	} else {
		alert('HTTP-Error: ' + response.status)
	}
})

const listenToEditModal = () => {
	const editDoggo = document.querySelectorAll('.editDog')

	editDoggo.forEach(doggo =>
		doggo.addEventListener('click', async e => {
			const doggoName =
				e.target.parentElement.parentElement.nextElementSibling
					.nextElementSibling.firstElementChild.innerText
			const doggoDesc =
				e.srcElement.parentElement.parentElement.nextElementSibling
					.nextElementSibling.children[1].innerText

			// Insert name and description into modal
			const editModalName = document.querySelector('#editName')
			const editModalDesc = document.querySelector('#editDescription')

			editModalName.innerHTML = `
					<label>Doggo name</label>
					<input class="form-control" placeholder="${doggoName}" required>`
			editModalDesc.innerHTML = `
					<label class="mt-3">Doggo description</label>
					<textarea class="form-control" placeholder="${doggoDesc}" rows="3" required></textarea>`

			$('#editDog').modal('toggle')
			// Put request for editing doggo
		})
	)
}

const listenToDeleteModal = () => {
	const deleteDoggo = document.querySelectorAll('.deleteDog')

	deleteDoggo.forEach(doggo => {
		doggo.addEventListener('click', async e => {
			const doggoName =
				e.srcElement.parentNode.parentElement.nextElementSibling
					.nextElementSibling.firstElementChild.innerText

			// Insert doggo name into modal before toggling
			const deleteModalBody = document.querySelector('.deleteModalBody')

			deleteModalBody.innerHTML = `<p>Are you sure to delete  <span class="doggoName">${doggoName}</span> permanently?</p>`

			$('#deleteDog').modal('toggle')
			// delete dog request
		})
	})
}

loadDoggos()
	.then(result => {
		listenToDeleteModal()
		listenToEditModal()

		// Add event listener on every doggo card's delete button
		// const deleteDoggo = document.querySelectorAll('.deleteDog')

		// deleteDoggo.forEach(doggo => {
		// 	doggo.addEventListener('click', async e => {
		// 		const doggoName =
		// 			e.srcElement.parentNode.parentElement.nextElementSibling
		// 				.nextElementSibling.firstElementChild.innerText

		// 		// Insert doggo name into modal before toggling
		// 		const deleteModalBody = document.querySelector('.deleteModalBody')

		// 		deleteModalBody.innerHTML = `<p>Are you sure to delete  <span class="doggoName">${doggoName}</span> permanently?</p>`

		// 		$('#deleteDog').modal('toggle')
		// 		// delete dog request
		// 	})
		// })
	})
	.catch(error => console.log('Error: ', error))

const deleteRequest = async (data = {}) => {
	const response = await fetch('/users/delete-doggo', {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'DELETE',
		body: JSON.stringify(data)
	})

	const status = response.status
	const res = await response.json()

	return { status, res }
}

// Confirm delete button
const confirmDelete = document.querySelector('#confirmDelete')

confirmDelete.addEventListener('click', async e => {
	const doggoName = document.querySelector('.doggoName').innerHTML

	data = { doggoName }
	deleteRequest(data)
		.then(res => {
			// confirm if response.ok
			document.querySelector('.doggo-delete-success').style.display = 'block'

			setTimeout(() => {
				document.querySelector('.doggo-delete-success').style.display = 'none'
				$('#deleteDog').modal('toggle')
			}, 1500)

			return loadDoggos()
		})
		.then(next => {
			listenToDeleteModal()
			listenToEditModal()
		})
		.catch(error => {
			alert(error)
			console.log({ error })
		})
})

const editRequest = async (data = {}) => {
	const response = await fetch('/users/edit-doggo', {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'PUT',
		body: JSON.stringify(data)
	})

	const status = response.status
	const res = await response.json()

	return { status, res }
}

const editForm = document.querySelector('#editForm')

editForm.addEventListener('submit', async e => {
	e.preventDefault()

	const data = {
		doggoName: e.target.elements[0].placeholder,
		newDogName: e.target.elements[0].value,
		newDogDesc: (newDogDesc = e.target.elements[1].value)
	}

	editRequest(data)
		.then(res => {
			document.querySelector('.doggo-edit-success').style.display = 'block'

			setTimeout(() => {
				document.querySelector('.doggo-edit-success').style.display = 'none'
				$('#editDog').modal('toggle')
			}, 1500)

			return loadDoggos()
		})
		.then(next => {
			listenToDeleteModal()
			listenToEditModal()
		})
		.catch(error => {
			alert(error)
			console.log({ error })
		})
})
