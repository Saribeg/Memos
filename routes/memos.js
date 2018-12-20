const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const shortid = require('shortid');

const User = require('../models/user');
const Memo = require('../models/memo');

//Функция для проверки залогинен пользователь или нет
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/users/login');
	}
}

/*router.get('/memo', ensureAuthenticated, async (req, res) => {

	let memo1 = new Memo({
		memoid: shortid.generate(),
		username: req.user.username,
		memoTitle: req.body.memoTitle,
		memoDescription: req.body.memoDescription,
		memoList: [
			"Перший List-Item",
			"Другий List-Item",
			"Третій List-Item",
			"Четвертий List-Item",
			"П'ятий List-Item"
		],
		memoLinks: [{
				link: "https://pugjs.org/language/iteration.html",
				linkText: "Pug"
			},
			{
				link: "https://metanit.com/web/nodejs/2.6.php",
				linkText: "NodeJS"
			},
			{
				link: "https://uk.lipsum.com/",
				linkText: "lipsum"
			},
			{
				link: "https://www.google.com",
				linkText: "google"
			},
			{
				link: "https://fontawesome.com/",
				linkText: "fontawesome"
			},
		],
		memoColor: "memo-green",
		memoDate: "01.12.2018"
	});

	let memo2 = new Memo({
		memoid: shortid.generate(),
		username: req.user.username,
		memoTitle: "Друга нотатка тут як тут",
		memoDescription: "На відміну від поширеної думки Lorem Ipsum не є випадковим набором літер. Він походить з уривку класичної латинської літератури 45 року до н.е., тобто має більш як 2000-річну історію.",
		memoList: [
			"Існує багато варіацій",
			"уривків з Lorem Ipsum",
			"Якщо ви збираєтесь використовувати",
			"Більшість відомих генераторів",
			"Принципова відмінність"
		],
		memoColor: "memo-red",
		memoDate: "02.12.2018"
	});

	let memo3 = new Memo({
		memoid: shortid.generate(),
		username: req.user.username,
		memoTitle: "Також і третя нотатка",
		memoDescription: "Цей трактат з теорії етики був дуже популярним в епоху Відродження. Перший рядок Lorem Ipsum, \"Lorem ipsum dolor sit amet...\" походить з одного з рядків розділу 1.10.32.",
		memoLinks: [{
				link: "https://pugjs.org/language/iteration.html",
				linkText: "Чому ми ним користуємось?"
			},
			{
				link: "https://metanit.com/web/nodejs/2.6.php",
				linkText: "Звідки він походить?"
			},
			{
				link: "https://uk.lipsum.com/",
				linkText: "Де собі взяти трохи?"
			},
			{
				link: "https://www.google.com",
				linkText: "Переклад Х.Рекема англійською, 1914"
			},
			{
				link: "https://fontawesome.com/",
				linkText: "Класичний текст"
			},
		],
		memoColor: "memo-orange",
		memoDate: "03.12.2018"
	});

	let memo4 = new Memo({
		memoid: shortid.generate(),
		username: req.user.username,
		memoTitle: "Номер чотири нарешті і ти",
		memoDescription: "Це текст-\"риба\", що використовується в друкарстві та дизайні.",
		memoColor: "memo-blue",
		memoDate: "04.12.2018"
	});

	let memo5 = new Memo({
		memoid: shortid.generate(),
		username: req.user.username,
		memoTitle: "Пять, дай пять, ти же пять",
		memoDescription: "Існує багато варіацій уривків з Lorem Ipsum, але більшість з них зазнала певних змін на кшталт жартівливих вставок або змішування слів, які навіть не виглядають правдоподібно. Якщо ви збираєтесь використовувати Lorem Ipsum, ви маєте упевнитись в тому, що всередині тексту не приховано нічого, що могло б викликати у читача конфуз. Більшість відомих генераторів Lorem Ipsum в Мережі генерують текст шляхом повторення наперед заданих послідовностей Lorem Ipsum. Принципова відмінність цього генератора робить його першим справжнім генератором Lorem Ipsum. Він використовує словник з більш як 200 слів латини та цілий набір моделей речень - це дозволяє генерувати Lorem Ipsum, який виглядає осмислено. Таким чином, згенерований Lorem Ipsum не міститиме повторів, жартів, нехарактерних для латини слів і т.ін.",
		memoColor: "memo-yellow",
		memoDate: "05.12.2018"
	});

	let memo6 = new Memo({
		memoid: shortid.generate(),
		username: req.user.username,
		memoTitle: "Шість не така й погана цифра",
		memoDescription: "Класичний текст, використовуваний з XVI сторіччя, наведено нижче для всіх зацікавлених. Також точно за оригіналом наведено розділи 1.10.32 та 1.10.33 цицеронівського \"de Finibus Bonorum et Malorum\" разом із перекладом англійською, виконаним 1914 року Х.Рекемом.",
		memoColor: "memo-light-blue",
	});

	let memo7 = new Memo({
		memoid: shortid.generate(),
		username: req.user.username,
		memoTitle: "Сім - щаслива цифра"
	});

	let memo8 = new Memo({
		memoid: shortid.generate(),
		username: req.user.username,
		memoTitle: "Існує багато варіацій уривків з Lorem Ipsum",
		memoDescription: "Принципова відмінність цього генератора робить його першим справжнім генератором Lorem Ipsum.",
		memoList: [
			"Ааааааааа",
			"Ббббббббб",
			"Ввввввввв",
			"Ггггггггг",
			"Ддддддддд"
		],
		memoLinks: [{
				link: "https://pugjs.org/language/iteration.html",
				linkText: "1111111111"
			},
			{
				link: "https://metanit.com/web/nodejs/2.6.php",
				linkText: "2222222222"
			},
			{
				link: "https://uk.lipsum.com/",
				linkText: "3333333333"
			},
			{
				link: "https://www.google.com",
				linkText: "4444444444"
			},
			{
				link: "https://fontawesome.com/",
				linkText: "5555555555"
			},
		],
		memoColor: "memo-orange",
		memoDate: "10.12.2018"
	});

	let memo9 = new Memo({
		memoid: shortid.generate(),
		username: req.user.username,
		memoTitle: "Якщо ви збираєтесь використовувати Lorem Ipsum",
		memoDescription: "більш-менш нормальне розподілення літер на відміну від більш-менш нормальне розподілення літер на відміну від більш-менш нормальне розподілення літер на відміну від",
		memoList: [
			"1111111111",
			"2222222222",
			"3333333333",
			"4444444444",
			"5555555555"
		]
	});

	let memo10 = new Memo({
		memoid: shortid.generate(),
		username: req.user.username,
		memoTitle: "Якщо ви збираєтесь використовувати Lorem Ipsum",
		memoDescription: "більш-менш нормальне розподілення літер на відміну від більш-менш нормальне розподілення літер на відміну від більш-менш нормальне розподілення літер на відміну від",
		memoLinks: [{
				link: "https://pugjs.org/language/iteration.html",
				linkText: "Ааааааааа"
			},
			{
				link: "https://metanit.com/web/nodejs/2.6.php",
				linkText: "Ббббббббб"
			},
			{
				link: "https://uk.lipsum.com/",
				linkText: "Ввввввввв"
			},
			{
				link: "https://www.google.com",
				linkText: "Ггггггггг"
			},
			{
				link: "https://fontawesome.com/",
				linkText: "Ддддддддд"
			},
		],
	});

	await memo1.save((err) => {
		if (err) return console.log(err);
	});

	await memo2.save((err) => {
		if (err) return console.log(err);
	});

	await memo3.save((err) => {
		if (err) return console.log(err);
	});

	await memo4.save((err) => {
		if (err) return console.log(err);
	});

	await memo5.save((err) => {
		if (err) return console.log(err);
	});

	await memo6.save((err) => {
		if (err) return console.log(err);
	});

	await memo7.save((err) => {
		if (err) return console.log(err);
	});

	await memo8.save((err) => {
		if (err) return console.log(err);
	});

	await memo9.save((err) => {
		if (err) return console.log(err);
	});

	await memo10.save((err) => {
		if (err) return console.log(err);
	});

	//let memo1str = JSON.stringify(memo1, "", 2);
	//let memo2str = JSON.stringify(memo2, "", 2);

	//let memostr = memo1str + "\n" + "\n" + "\n" + memo2str;

	//res.send(memostr);

	res.redirect('/' + req.user.username);

});*/

// Создание новой заметки

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

	console.log(req.body);

	res.render('one_memo', {
		userMemo: userMemo
	});

});

//Удаление заметки

router.delete('/delete-memo/:memoid', ensureAuthenticated, async (req, res) => {

	// console.log(req.params.memoid);

	let memoid = req.params.memoid;

	Memo.findOneAndDelete({memoid:memoid}, (err, memo) => {

		if(err) return console.log(err);

		res.send(memoid);
	})

});

router.put('/update-memo/:memoid', ensureAuthenticated, async (req, res) => {

	// let memoid = req.params.memoid;

	Memo.find({memoid: req.params.memoid}, (err, docs) => {

		if(err) return console.log(err);

		console.log(docs);
		console.log(typeof docs);
		console.log(typeof docs[0].memoList);
		console.log(docs.length);
		

		res.render('one_memo', {
			userMemo: docs[0]
		});


		
	});

	// console.log(memoid);

});


module.exports = router;