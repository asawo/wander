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

	return await response.json()
}

// Log in
signUpForm.addEventListener('submit', e => {
	e.preventDefault()

	const signUpFormData = {
		username: e.target.elements[0].value,
		password: e.target.elements[1].value
	}

	postData('../signup', signUpFormData).then(data => {
		if (data.registration === 'SUCCESS') {
			// show success message and close modal
			$('.sign-up-success').show()
		} else {
			// show alert message
			$('.sign-up-alert').show()
		}
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
		if (data.authenticated === true) {
			window.location.replace('/home')
			console.log(data.url)
		} else {
			console.log(data)
			$('.sign-in-alert').show()
		}
	})
})

module.exports = postData
