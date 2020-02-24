const logOutBtn = document.querySelector('#logOut')

logOutBtn.addEventListener('click', async e => {
	let response = await fetch('/logout')

	if (response.ok) {
		window.location.replace(response.url)
	} else {
		alert('HTTP-Error: ' + response.status)
	}
})

// console.log(e)
// getData('/logout').then(res => {
// 	if (res.status === 301) {
// 		console.log(res.status)
// window.location.replace('/')
