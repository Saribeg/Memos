const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const shortid = require('shortid');

const User = require('../models/user');

router.get('/register', (req, res) => {
	res.render('register');
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/register', async (req, res) => {

	// Получаем данные из формы регистрации и записываем в переменные
	
	let id = shortid.generate();
	let name = req.body.userName;
	let email = req.body.userEmail;
	let password = req.body.userPassword;
	let password2 = req.body.userPasswordConfirm;

	// Настраиваем валидации на стороне сервера с помощью express-validator
	// Это дополнительная защита к валидациям на стороне клиента (вдруг кто-то отправит запрос не с браузера, а просто post-запрос другими способами)
	req.checkBody("userName", "Логін обов'язковий").notEmpty(); // Чтобы input с name=userName не было пустым
	req.checkBody("userEmail", "Email обов'язковий").notEmpty(); // Чтобы input с name=userEmail не было пустым
	req.checkBody("userEmail", "Email некоректний").isEmail(); // Чтобы input с name=userEmail имел формат электронной почты
	req.checkBody("userPassword", "Пароль обов'язковий").notEmpty(); // Чтобы input с name=userPassword не было пустым
	req.checkBody("userPasswordConfirm", "Пароль не співпадає").equals(req.body.userPassword); // Чтобы input с name=userPasswordConfirm совпадал с input с name=userPassword

	let errors = req.validationErrors();

	if(errors){
		res.render('register', {
			errors: errors,
			msg: req.checkBody.msg
		});
	} else {
		let newUser = new User({
			userid: id,
			username: name,
			email: email,
			password: password
		});

		const user = await User.findOne({ username: name });
      if (user) {
				req.flash('error_msg', 'Такий логін вже існує! Логін повинен бути унікальним!');
        res.redirect('/users/register');
      }else{
				User.createUser(newUser, (err, user) => {

					if(err) throw err;

				});
		
				req.flash('success_msg', "Ви успішно зарееєструвались та можете увійти");
		
				res.redirect('/users/login');
			}

	}

});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Такий користувач не знайдений.' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Некоректний паспорт.' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	}
);

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});


module.exports = router; 