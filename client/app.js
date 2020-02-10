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
			console.log(res)
		})
		.catch(e => {
			console.log(e)
		})
}

function signIn(jsonData) {
	fetch('../signin', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(jsonData)
	})
		.then(res => {
			console.log(res)
		})
		.catch(e => {
			console.log(e)
		})
}

signUpForm.addEventListener('submit', e => {
	const signUpFormData = {
		username: e.target.elements[0].value,
		password: e.target.elements[1].value
	}

	signUp(signUpFormData)
})

signInForm.addEventListener('submit', e => {
	const signInFormData = {
		username: e.target.elements[0].value,
		password: e.target.elements[1].value
	}

	signIn(signInFormData)
})
