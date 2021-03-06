var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var empleadoRouter = require('./routes/empleado');
var clienteRouter = require('./routes/cliente');
const session = require('express-session');
var flash = require('req-flash');
let EstaAutentiEmpleado = require("./routes/empleado").EstaAutentEmpleado;
let EstaAutentiCliente = require("./routes/cliente").EstaAutentCliente;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: true
}));
app.use(flash());
app.use('/', indexRouter);
app.use('/empleado', EstaAutentiEmpleado, empleadoRouter);
app.use('/cliente', EstaAutentiCliente, clienteRouter);

// catch 404 and forward to error handler
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