
'use strict';

	async function getUser() {

		let result;
		console.log('work')
		try {
			result = await axios({
				method: 'post',
				url: 'http://localhost:3000/users/registers',
				data: {
					email: 'aaa@fff.fff'
				}
			});
			console.log(result);
		} catch (error) {
			console.error(error);
		}
	}



/*fetch('/users/register').then( (response) => {
	console.log(response);
	return response;
});*/