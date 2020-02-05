const signInForm = document.querySelector('#signInForm')
const signUpForm = document.querySelector('#signUpForm')

// Sign in with form data
function signIn(jsonData) {
	fetch('../signin', {
		method: 'post',
		headers: {
			Accept: 'application/json',
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

signInForm.addEventListener('submit', e => {
	event.preventDefault()
	const signInFormData = {
		username: e.target.elements[0].value,
		password: e.target.elements[1].value
	}

	signIn(signInFormData)
})

signUpForm.addEventListener('submit', e => {
	event.preventDefault()
})
