var createError = require('http-errors');
var express = require('express');
const fs = require('fs')
const path = require('path')
var cookieParser = require('cookie-parser');//生成cookie
var logger = require('morgan');//获取日志

const session = require('express-session');
const RedisStore = require('connect-redis')(session)
const redisClient = require('./db/redis')
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog')
const userRouter = require('./routes/user')

var app = express();

// view engine setup 视图引擎，前后端分离不关心
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// 设置头,跨域
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4444");
  // res.header("Access-Control-Allow-Headers", "*");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
})
// 日志
const ENV = process.env.NODE_ENV
if(ENV !== 'production') {
  //开发环境
  app.use(logger('dev'))
}else{
  //线上环境
  const logFileName = path.join(__dirname,'logs','access.log')
  const writeStream = fs.createWriteStream(logFileName,{
    flags:'a'
  })
  app.use(logger('combined',{
    stream:writeStream//表示可以传入其他参数
  }));
}

app.use(express.json());//获取请求的数据（post）
app.use(express.urlencoded({ extended: false }));//兼容请求数据格式
app.use(cookieParser());

//session
const sessionStore = new RedisStore({
  client:redisClient
})
app.use(session({
  resave: false, //添加 resave 选项
  saveUninitialized: true,//添加 saveUninitialized 选项
  // *上面两项是为了解决报错建议*
  secret:'WJiol#8776_',
  cookie:{
    secure: false,
    path:'/',
    httpOnly:true,
    maxAge:24 * 60 * 60 * 1000
  },
  store:sessionStore
}));
// app.use(express.static(path.join(__dirname, 'public')));//静态使用，先注释

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handlerq
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
