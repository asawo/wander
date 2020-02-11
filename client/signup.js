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
	const signUpFormData = {
		username: e.target.elements[0].value,
		password: e.target.elements[1].value
	}

	postData('../signup', signUpFormData).then(data => {
		console.log(data)
	})
})

signInForm.addEventListener('submit', e => {
	const signInFormData = {
		username: e.target.elements[0].value,
		password: e.target.elements[1].value
	}

	postData('../signin', signInFormData).then(data => {
		console.log(data)
	})
})
