const newDog = document.querySelector('#newDog')

newDog.addEventListener('submit', e => {
	e.preventDefault()

	console.log(e)

	const doggoProfile = {
		doggoName: e.target.elements[0].value,
		doggoImage: e.target.elements[1].value,
		description: e.target.elements[2].value
	}

	if (signUpFormData.password === secondPassword) {
		postData('../users/add-doggo', doggoProfile).then(data => {
			if (data.status === 200) {
				$('.doggo-created').show() // success label for creating doggo
			} else {
				$('.doggo-exists').show() // doggo exists!
			}
		})
	} else {
		$('.something-went-wrong').show() // something went wrong!
	}
})
