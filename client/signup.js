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

	const status = response.status
	const res = await response.json()

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

	if (signUpFormData.password !== secondPassword) {
		document.querySelector('.wrong-password').style.display = 'block'
	} else {
		postData('../signup', signUpFormData)
			.then(data => {
				if (data.status === 200) {
					document.querySelector('.sign-up-success').style.display = 'block'
				} else {
					document.querySelector('.user-already-exists').style.display = 'block'
				}
				return postData('../signin', signUpFormData)
			})
			.then(data => {
				if (data.status === 301) {
					setTimeout(() => {
						window.location.replace('/users/home')
					}, 1000)
				}
			})
			.catch(error => console.log({ error }))
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
