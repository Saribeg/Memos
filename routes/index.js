const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Memo = require('../models/memo');

router.get('/', ensureAuthenticated, (req, res) => {
	res.redirect('/' + req.user.username);
});

router.get('/:user', ensureAuthenticated, (req, res) => {
	// console.log(req.user);

	Memo.find({username: req.user.username}, (err, docs) => {
		if(err) return console.log(err);

		/*let testObj = {
			title: docs[0].memoTitle,
			links: docs[0].memoLinks,
			text: docs[0].memoDescription
		}*/

		/*let arrtest = [];

		docs.forEach(function(item, i, arr){
			arrtest.push(item['username'] + " : " + item['memoTitle']);
		});

		res.send(arrtest);*/

		//res.send(docs);

		//let userMemos = docs;
		//res.send(userMemos);

		// docs.forEach(function(item, i, arr){
		// 	console.log(item['memoLinks'].length)
		// });
		

		res.render('index', {
			userMemos: docs
		});

	});
	
	//res.render('index');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;