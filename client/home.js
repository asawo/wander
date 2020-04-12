const timeline = document.querySelector('#timeline')

const addDoggos = (
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

					<button type="button" class="btn btn-dark" id="patButton">Pat 👋</button>

					<button type="button" class="btn btn-secondary" id="likeButton"><i class="fa fa-heart" style="pointer-events: none;"></i> (${likes})</button>
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
		resJson.doggos.forEach((doggo) => {
			addDoggos(
				doggo.doggoid,
				doggo.doggoname,
				doggo.description,
				doggo.imageurl,
				doggo.username,
				doggo.likestotal
			)
		})
	} else if (response.ok && resJson.doggos.length === 0) {
		console.log('HTTP-status: ' + response.status + ' but no data')
		alert('HTTP-Error: ' + response.status)
	} else {
		alert('HTTP-Error: ' + response.status)
	}
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

const toggleLike = (element) => {
	if (!element.classList.contains('liked')) {
		element.classList.add('liked')
	} else {
		element.classList.remove('liked')
	}
}

const listenToLikeButton = () => {
	const likeButtons = document.querySelectorAll('#likeButton')
	likeButtons.forEach((button) => {
		button.addEventListener('click', async (e) => {
			const doggoId = e.srcElement.parentNode.id

			if (!button.classList.contains('liked')) {
				// likeDog({ doggoId })
			} else {
				// make function unlikeDog({ doggoId }) here
			}
			// loadAll then toggleLike (or else loadAll overwrites toggleLike)
			toggleLike(button)
			// somehow add "liked" class if user already liked the doggo - need to maybe tweak loadDoggos()
		})
	})
}

loadDoggos()
	.then((result) => {
		listenToLikeButton()
	})
	.catch((error) => {
		console.log('Error: ', error)
	})

const logOutBtn = document.querySelector('#logOut')

logOutBtn.addEventListener('click', async (e) => {
	const response = await fetch('/logout')

	if (response.ok) {
		window.location.replace(response.url)
	} else {
		alert('HTTP-Error: ' + response.status)
	}
})
