const signInForm = document.querySelector('#signInForm')
const signUpForm = document.querySelector('#signUpForm')

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

// Log in

signUpForm.addEventListener('submit', e => {
	e.preventDefault()
	document.querySelector('.alert').style.display = 'none'

	const signUpFormData = {
		username: e.target.elements[0].value,
		password: e.target.elements[1].value
	}

	const secondPassword = e.target.elements[2].value

	if (signUpFormData.password === secondPassword) {
		postData('../signup', signUpFormData).then(data => {
			if (data.status === 200) {
				// Show success banner
				document.querySelector('.sign-up-success').style.display = 'block'

				postData('../signin', signUpFormData).then(data => {
					console.log(data)
					if (data.status === 301) {
						setTimeout(() => {
							window.location.replace('/users/home')
						}, 1000)
					}
				})
			} else {
				// $('.sign-up-alert').show()
				document.querySelector('.user-already-exists').style.display = 'block'
			}
		})
	} else {
		// $('.wrong-password').show()
		document.querySelector('.wrong-password').style.display = 'block'
	}
})

// Hides all alerts on keyup
signUpForm.addEventListener('keyup', e => {
	document.querySelectorAll('.alert').forEach(alert => {
		alert.style.display = 'none'
	})
})

// Registration
signInForm.addEventListener('submit', e => {
	e.preventDefault()

	const signInFormData = {
		username: e.target.elements[0].value,
		password: e.target.elements[1].value
	}

	postData('../signin', signInFormData).then(data => {
		console.log(data)
		if (data.status === 301) {
			window.location.replace('/users/home')
		} else {
			$('.sign-in-alert').show()
		}
	})
})

signInForm.addEventListener('keyup', e => {
	document.querySelector('.sign-in-alert').style.display = 'none'
})
