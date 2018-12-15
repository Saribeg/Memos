const mongoose = require('mongoose');
//const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

let UserSchema = mongoose.Schema({
	userid:{
		type: String,
		required: true,
		index: true,
    unique: true
	},
	username: {
		type: String,
		required: true,
    unique: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		index: true,
		unique: true
	}
});

//UserSchema.plugin(uniqueValidator, {message: 'Такий користувач вже існує! Логін та email повинні бути унікальними'});

let User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err, hash) {
			newUser.password = hash;
			newUser.save(callback);
		});
	});
};

// Функция для поиска пользователя по логину
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback); 
}

// Функция для поиска пользователя по ID из БД
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

