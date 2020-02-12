const signInForm = document.querySelector('#signInForm')
const signUpForm = document.querySelector('#signUpForm')

// Sign in with form data
async function postData(url = '', data = {}) {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		body: JSON.stringify(data)
	})

	return await response.json()
}

signUpForm.addEventListener('submit', e => {
	e.preventDefault()
	const signUpFormData = {
		username: e.target.elements[0].value,
		password: e.target.elements[1].value
	}

	postData('../signup', signUpFormData).then(data => {
		if (data.registration === 'SUCCESS') {
			// show success message and close modal
			console.log('SUCCESS')
			$('.sign-up-success').show()
		} else {
			// show alert message
			console.log('nope')
			$('.sign-up-alert').show()
		}
	})
})

signInForm.addEventListener('submit', e => {
	e.preventDefault()
	const signInFormData = {
		username: e.target.elements[0].value,
		password: e.target.elements[1].value
	}

	postData('../signin', signInFormData).then(data => {
		if (data.authenticated === true) {
			window.location.replace('/home')
			console.log(data.url)
		} else {
			console.log(data)
			$('.sign-in-alert').show()
		}
	})
})
