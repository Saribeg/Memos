const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const shortid = require('shortid');

const User = require('../models/user');
const Memo = require('../models/memo');
const Archive = require('../models/archivedMemo');

//Функция для проверки залогинен пользователь или нет
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/users/login');
	}
}


// ========================================== Создание заметки ==========================================


// Показать модальное окно (пустое) для заполнения данных

router.get('/show-create-memo-modal', ensureAuthenticated, async (req, res) => {

	res.render('001-create-memo');

});

// Получить данные с клиента (браузера) и записать в БД, т.е. создать заметку

router.post('/create-memo', ensureAuthenticated, async (req, res) => {

	let memoListItems = req.body.list;

	for(let i=0;i<memoListItems.length;i++){
		memoListItems[i].listItemId = shortid.generate();
	}

	let userMemo = new Memo({
		memoid: shortid.generate(),
		username: req.user.username,
		memoTitle: req.body.title,
		memoDescription: req.body.description,
		memoDate: req.body.date,
		memoColor: req.body.color,
		memoLinks: req.body.links,
		memoList: memoListItems
	});

	await userMemo.save((err) => {
		if (err) return console.log(err);
	});

	res.render('one_memo', {
		userMemo: userMemo
	});

});

// ========================================== Удаление заметки ==========================================

router.delete('/delete-memo/:memoid', ensureAuthenticated, async (req, res) => {

	let memoid = req.params.memoid;

	Memo.findOneAndDelete({memoid:memoid}, (err, memo) => {

		if(err) return console.log(err);

		res.send(memoid);
	})

});

// ========================================== Удаление заметки ==========================================

// Показать модальное окно с заполненными данными по существующей заметке

router.get('/show-memo-for-update/:memoid', ensureAuthenticated, async (req, res) => {

	Memo.find({memoid: req.params.memoid}, (err, docs) => {

		if(err) return console.log(err);

		res.render('002-update-memo', {
			userMemo: docs[0]
		});

	});

});

// Получить от браузера новые параметры заметки и перезаписать старые параметры в БД новыми

router.put('/update-memo/:memoid', ensureAuthenticated, async (req, res) =>{

	let memoListItems = req.body.newMemoList;

	for(let i=0;i<memoListItems.length;i++){
		memoListItems[i].listItemId = shortid.generate();
	}

	Memo.findOneAndUpdate({memoid: req.body.memoId}, {
		memoTitle: req.body.newMemoTitle,
		memoDescription: req.body.newMemoDescription,
		memoDate: req.body.newMemoDate,
		memoColor: req.body.newMemoColor,
		memoLinks: req.body.newMemoLinks,
		memoList: req.body.newMemoList
	}, {new: true}, (err, docs) => {

		if(err) return console.log(err);

		res.render('one_memo', {
			userMemo: docs
		});


	});

});

// Сохранять в БД статус отмечен лист-айтем в чек-боксе или нет

router.put('/update-list-item-checked/:checkedListItemId', ensureAuthenticated, async (req, res) =>{

	Memo.findOneAndUpdate(
		{memoid: req.body.memoId, 'memoList.listItemId': req.body.checkedListItemId},
		{
			"$set": {
				"memoList.$.listItemStatus": req.body.checkedListItemStatus
			}
		},
		{new: true}, 
		(err, memo) => {

			if(err) console.log(err);

		});

});

// ========================================== Архивация заметки ==========================================

// Перенос заметки в архив

router.put('/move-memo-to-archive/:memoid', ensureAuthenticated, async (req, res) =>{

	let memoid = req.body.memoId;

	// Находим архивируемое мемо и записываем в переменную result
	let result = await Memo.findOne({memoid:memoid}).select('-_id -memoLinks._id -memoList._id -__v');
	
	// Обрабатываем объект, который вернулся из БД, чтобы записать в другую коллекцию
	let archivingMemo = {
		memoid: result.memoid,
		username: result.username,
		memoTitle: result.memoTitle,
		memoDescription: result.memoDescription,
		memoDate: result.memoDate,
		memoColor: result.memoColor,
		memoLinks: result.memoLinks,
		memoList: result.memoList
	}

	// Записываем в коллекцию архива
	let archivedMemo = new Archive(archivingMemo);

	await archivedMemo.save((err) => {
		if (err) return console.log(err)
	})

	// Удаляем из коллекции актуальных мемо
	await Memo.findOneAndDelete({memoid:memoid}, (err, memo) => {

		if(err) return console.log(err);

		res.send(memoid);
	})

});

//Удаление заметки из врхива

router.delete('/delete-memo-from-archive/:memoid', ensureAuthenticated, async (req, res) => {

	let memoid = req.params.memoid;

	Archive.findOneAndDelete({memoid:memoid}, (err, memo) => {

		if(err) return console.log(err);

		res.send(memoid);
	})

});

// Восстановление заметки из архива в основную страницу (в список актуальных заметок)

router.put('/undo-memo-from-archive/:memoid', ensureAuthenticated, async (req, res) =>{

	let memoid = req.body.memoId;

	// Находим архивируемое мемо и записываем в переменную result
	let result = await Archive.findOne({memoid:memoid}).select('-_id -memoLinks._id -memoList._id -__v');
	
	// Обрабатываем объект, который вернулся из БД, чтобы записать в другую коллекцию
	let archivedMemo = {
		memoid: result.memoid,
		username: result.username,
		memoTitle: result.memoTitle,
		memoDescription: result.memoDescription,
		memoDate: result.memoDate,
		memoColor: result.memoColor,
		memoLinks: result.memoLinks,
		memoList: result.memoList
	}

	// Записываем в коллекцию архива
	let undoMemo = new Memo(archivedMemo);

	await undoMemo.save((err) => {
		if (err) return console.log(err)
	})

	// Удаляем из коллекции актуальных мемо
	await Archive.findOneAndDelete({memoid:memoid}, (err, memo) => {

		if(err) return console.log(err);

		res.send(memoid);
	})

});

// ========================================== Статистика ==========================================

// Получить статистику по количеству заметок и передать на клиента для отображения

router.get('/get-memo-statistics', ensureAuthenticated, async (req, res) => {

	let actualMemoQuantity = await Memo.count({username: req.user.username});
	let archivedMemoQuantity = await Archive.count({username: req.user.username});

	let statistics = {
		actualMemoQuantity: actualMemoQuantity,
		archivedMemoQuantity: archivedMemoQuantity
	}

	res.send(statistics);

});


module.exports = router;