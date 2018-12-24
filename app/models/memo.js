const mongoose = require('mongoose');

let MemoSchema = mongoose.Schema({
	memoid:{
		type: String,
		required: true,
		index: true,
    unique: true
	},
	username:{
		type: String,
		required: true
	},
	memoTitle: {
		type: String,
		required: true
	},
	memoDescription: {
		type: String,
		required: false
	},
	memoList: [
		{listItem: {type: String}, listItemStatus: {type: Boolean, default: false}, listItemId: {type: String}}
	],
	memoLinks: [
		{link: {type: String}, linkText: {type: String}}
	],
	memoColor: {
		type: String,
		required: false
	},
	memoDate: {
		type: String,
		required: false
	},
	memoImage: {
		data: Buffer, 
		contentType: String,
		required: false
	}
});

let Memo = module.exports = mongoose.model('Memo', MemoSchema, 'memos');