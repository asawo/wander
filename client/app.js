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
		redirect: 'follow',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(jsonData)
	})
		.then(res => {
			if (res) {
				console.log(res)
			}
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
	// signUp(signUpFormData)
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
	// signIn(signInFormData)
})
