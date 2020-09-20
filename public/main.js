const log = require('./util/util.js').log;

let update = document.getElementById('update')
update.addEventListener('click', function () {
	fetch('monsters', {
  		method: 'put',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
		    'name': 'Goblin',
		    'special': 'something particularly interesting. hehel.'
  		})
	})
	.then(response => {
		if (response.ok) return response.json()
	})
	.then(data => {
		log(data, true)
		window.location.reload(true)
	})
})

let del = document.getElementById('delete')
del.addEventListener('click',function (){
	fetch('monsters', {
		method: 'delete',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			'name': 'Goblin'
		})
	})
	.then(response => {
		if (response.ok) return response.json()
	})
	.then(data => {
		log(data, true)
		window.location.reload()
	})
})

let validatorUpdate = document.getElementById('validatorUpdate')
validatorUpdate.addEventListener('click',function () {
	fetch('validator', {
		method: 'post',
		headers: {'Content-Type': 'application/json'}
	})
})