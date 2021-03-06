const alreadyLiked = async (doggoId) => {
	const result = await fetch(`/users/check-like/${doggoId}`)
	const response = await result.json()
	return response
}

const likeDog = async (doggoId = {}) => {
	const response = await fetch('/users/like-doggo', {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify(doggoId),
	})

	const status = response.status
	const res = await response.json()
	return { status, res }
}

const unlikeDog = async (doggoId = {}) => {
	const response = await fetch('/users/unlike-doggo', {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'DELETE',
		body: JSON.stringify(doggoId),
	})

	const status = response.status
	const res = await response.json()
	return { status, res }
}

const listenToLikeButton = () => {
	const likeButtons = document.querySelectorAll('#likeButton')
	likeButtons.forEach((button) => {
		button.addEventListener('click', async (e) => {
			const doggoId = e.srcElement.parentNode.id

			if (!button.classList.contains('liked')) {
				await likeDog({ doggoId })
			} else {
				await unlikeDog({ doggoId })
			}
			await loadDoggos()
		})
	})
}

const toggleLike = (element) => {
	if (!element.classList.contains('liked')) {
		element.classList.add('liked')
	} else {
		element.classList.remove('liked')
	}
}

const timeline = document.querySelector('#timeline')

const addDoggos = async (
	doggoId,
	doggoName,
	description,
	imageurl,
	username,
	likes
) => {
	timeline.innerHTML += `
	<div class="doggos text-left text-wrap container" style="border-radius: 5px; overflow-wrap: break-word; background-color: #ffffff; max-width: 660px;">
		<div class="mt-5 mx-auto">
			<img src=${imageurl} class="pt-3" alt="Doggo image" width="100%">
			<div class="card-body">
				<h1 class="dogName">${doggoName}</h1>
				<p class="dogDescription">${description}</p>
				<p class="font-italic text-muted"> – Added by ${username}</p>
				<span class="mt-3" id="${doggoId}">
					<button type="button" class="btn btn-dark" id="patButton" data-container="body" data-toggle="popover" data-placement="top" data-content="Very wow, such great pat technique Thanks for the pat, human 🐶❤️🦴">Pat 👋</button>
					<button type="button" class="btn btn-secondary like-button-${doggoId}" id="likeButton"><i class="fa fa-heart" style="pointer-events: none;"></i> (${likes})</button>
				</span>
			</div>
		</div>
	</div> \n`

	if (await alreadyLiked(doggoId)) {
		const button = document.querySelector(`.like-button-${doggoId}`)
		toggleLike(button)
	}
}

async function loadDoggos() {
	const response = await fetch('/all-doggos')
	const data = await response.json()

	if (response.ok && data.doggos.length > 0) {
		timeline.innerHTML = ''
		data.doggos.forEach((doggo) => {
			if (doggo.likestotal === null) {
				doggo.likestotal = 0
			}
			addDoggos(
				doggo.doggoid,
				doggo.doggoname,
				doggo.description,
				doggo.imageurl,
				doggo.username,
				doggo.likestotal
			)
		})

		listenToLikeButton()
		// initialize popovers
		$(function () {
			$('[data-toggle="popover"]').popover()
		})
	} else if (response.ok && data.doggos.length === 0) {
		console.log('HTTP-status: ' + response.status + ' but no data')
		alert('HTTP-Error: ' + response.status + ' but no data')
	} else {
		alert('HTTP-Error: ' + response.status)
	}
}

loadDoggos()

const logOutBtn = document.querySelector('#logOut')

logOutBtn.addEventListener('click', async (e) => {
	const response = await fetch('/logout')

	if (response.ok) {
		window.location.replace(response.url)
	} else {
		alert('HTTP-Error: ' + response.status)
	}
})
