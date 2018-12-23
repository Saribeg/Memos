const express = require('express'); 
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pug = require('pug');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const database = require('./configs/db');

mongoose.connect(database.url, { useNewUrlParser: true });
const db = mongoose.connection;

const routes = require('./routes/index');
const users = require('./routes/users');
const memos = require('./routes/memos');

// Инициализируем наше приложение
const app = express();

// Настраиваем работу с шаблонизатором pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Подключаем Middleware для обработки запросов
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Используем статическую папку "public", где будут располагаться все файлы для frontend, то есть css, клиентский js, картинки и прочие материалы, используемые на стороне клиента (браузера)
app.use(express.static(path.join(__dirname, 'public')));

// Используем session middleware (Express Session) для корректной/безопасной реализации логина с испольщованием сессий
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// Инициализируем модуль passport.js 
app.use(passport.initialize());
app.use(passport.session());

// Используем удобный middleware для валидации данных формы на стороне сервера
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Подключаем middleware для удобного выведения сообщений пользователю в процессе обработки запросов (connect-flash)
app.use(flash());

/* Для middleware "connect-flash" определяем локальные переменные, в которых мы будем собирать данные для использования в рендеринге темплэйтов (pug).
Использование res.locals предусмотрено в документации express: "An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any)".
*/
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); // У passport.js есть свои собственные error-messages, поэтому присутствует эта строка дополнительно к 'error_msg'
  res.locals.user = req.user || null;
  next();
});

//Использование роутов
app.use('/', routes);
app.use('/users', users);
app.use('/memos', memos);

// Устанавливаем порт и запускаем сервер
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port'));
});


