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

	return await response
}

signUpForm.addEventListener('submit', e => {
	e.preventDefault()
	const signUpFormData = {
		username: e.target.elements[0].value,
		password: e.target.elements[1].value
	}

	postData('../signup', signUpFormData).then(data => {
		console.log(data.json())
	})
})

signInForm.addEventListener('submit', e => {
	e.preventDefault()
	const signInFormData = {
		username: e.target.elements[0].value,
		password: e.target.elements[1].value
	}

	postData('../signin', signInFormData).then(data => {
		if (data.redirected === true) {
			// redirect
		} else {
			// show error
			console.log('show alert')
			$('.alert').show()
		}
	})
})
