const signInForm = document.querySelector('#signInForm')
const signUpForm = document.querySelector('#signUpForm')

// Sign in with form data
function signUp(jsonData) {
	fetch('../signup', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(jsonData)
	})
		.then(res => {
			console.log('success!')
		})
		.catch(error => {
			console.log(error)
		})
}

signUpForm.addEventListener('submit', e => {
	event.preventDefault()
	const signUpFormData = {
		username: e.target.elements[0].value,
		password: e.target.elements[1].value
	}

	signUp(signUpFormData)
})

signInForm.addEventListener('submit', e => {
	event.preventDefault()
	const signInFormData = {
		username: e.target.elements[0].value,
		password: e.target.elements[1].value
	}

	// signIn(signInFormData)
})
