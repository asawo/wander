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

	const signUpFormData = {
		username: e.target.elements[0].value,
		password: e.target.elements[1].value
	}

	const secondPassword = e.target.elements[2].value

	if (signUpFormData.password === secondPassword) {
		postData('../signup', signUpFormData).then(data => {
			if (data.status === 200) {
				$('.sign-up-success').show()
				postData('../signin', signUpFormData).then(data => {
					console.log(data)
					if (data.status === 301) {
						setTimeout(() => {
							window.location.replace('/users/home')
						}, 1000)
					}
				})
			} else {
				$('.sign-up-alert').show()
			}
		})
	} else {
		$('.wrong-password').show()
	}
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
