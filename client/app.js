const signInForm = document.querySelector('#signInForm')
const signUpForm = document.querySelector('#signUpForm')

// async function postData(url = '', data = {}) {
// 	const response = await fetch(url, {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify(data)
// 	})
// 	return await response.json()
// }

signInForm.addEventListener('submit', e => {
	event.preventDefault()
	const signInFormData = {
		username: e.target.elements[0].value,
		password: e.target.elements[1].value
	}
	console.log(signInFormData)
})

signUpForm.addEventListener('submit', e => {
	event.preventDefault()
})
