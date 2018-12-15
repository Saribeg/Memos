'use strict';

// async function getUser() {

// 	let result;
// 	console.log('work')
// 	try {
// 		result = await axios({
// 			method: 'post',
// 			url: 'http://localhost:3000/users/registers',
// 			data: {
// 				email: 'aaa@fff.fff'
// 			}
// 		});
// 		console.log(result);
// 	} catch (error) {
// 		console.error(error);
// 	}
// }








// let saveBtn = document.getElementById("save-memo");
// console.log(saveBtn);
// saveBtn.addEventListener('submit', createMemo, false);

// async function createMemo(e) {
	
// 	let result;
// 	console.log('work');
// 	try {
// 		result = await axios({
// 			method: 'post',
// 			url: 'http://localhost:3000/memos/create-memo',
// 			data: {
// 				memoTitle: 'Fred',
// 				memoDescription: 'Flintstone',
// 				memoDate: 'dfsdfdsf'
// 			},
// 			 headers: {
// 			 	'Content-Type': 'application/x-www-form-urlencoded'
// 			 }
// 		});
// 		console.log(result);
// 	} catch (error) {
// 		console.error(error);
// 	}
	
// }
let form = document.getElementById("form");
let saveBtn = document.getElementById("save-memo");
let memoHeader = document.getElementById("form34");
let memoDescription = document.getElementById("form8");
let memoData = document.getElementById("form32");

form.addEventListener("submit", createMemo);

function createMemo(e) {
	e.preventDefault();
	let title = memoHeader.value;
	let description = memoDescription.value;
	let date = memoData.value;
	
	
	console.log(title);
	console.log(description);
	console.log(date);

	$.ajax({
		url: '/memos/create-memo',
		contentType: 'application/json',
		method: 'POST',
		data: JSON.stringify({
			title: title,
			description: description,
			date: date
		}),
		// success: function (memo) {
		// 	console.log(45);
		// 	console.log(memo);
		// }
	});
}