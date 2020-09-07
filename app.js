var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var bicyclesRouter = require('./routes/bicycles');
var bicyclesAPIRouter = require('./routes/api/bicycles');
var usersAPIRouter = require('./routes/api/users');
var usersRouter = require('./routes/users');
var tokenRouter = require('./routes/token');
var authRouter = require('./routes/api/auth');

const passport = require('./config/passport');
const session = require('express-session');
const jwt = require('jsonwebtoken');


const store = new session.MemoryStore;

var app = express();
app.use(session({
  cookie: {maxAge: 240*60*60*1000 },
  store: store,
  seveUnitialized: true,
  resave: 'true',
  secret: 'BHHSujbBUSnspownUNBSH_*'
}));
app.set('secretKey', 'jojobizzareadventure');

const User = require('./models/user');
const token = require('./models/token');
var mongoose = require('mongoose');
const { nextTick } = require('process');

var mongoDBPath = "mongodb+srv://admUser:AvUdCmTBCasY0i0d@cluster0.iy9dp.mongodb.net/BicycleNetwork?retryWrites=true&w=majority";
mongoose.connect(mongoDBPath, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB is connected');
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', function (req, res) {  
  res.render('sessions/login');
});

app.post('/login', function (req, res, next) {  
  passport.authenticate('local', function (err, user, info) {  
    if (err) return next(err);
    if (!user) return res.render('sessions/login', {info});
    req.login(user, function (err) {  
      if (err) return next(err);
      return res.redirect('/');
    })
  })(req, res, next);
});

app.get('/logout', function (req, res) {  
  req.logout();
  res.redirect('/');
});

app.get('/forgotPassword', function (req, res) {  
  res.render('sessions/forgotPassword');
});

app.post('/forgotPassword', function (req, res) {  
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) return res.render('sessions/forgotPassword', { info: { message: 'No existe el email para un usuario existente' } });
    
    user.resetPassword(function(err) {
      if (err) return next(err);
      console.log('sessions/forgotPasswordMessage');
    });
    
    res.render('sessions/forgotPasswordMessage');
  });
});

app.get('/resetPassword/:token', function(req, res, next) {
  console.log(req.params.token);
  token.findOne({ token: req.params.token }, function(err, token) {
    if(!token) return res.status(400).send({ msg: 'No existe un usuario asociado al token, verifique que su token no haya expirado' });
    User.findById(token._userId, function(err, user) {
      if(!user) return res.status(400).send({ msg: 'No existe un usuario asociado al token.' });
      res.render('sessions/resetPassword', {errors: { }, user: user});
    });
  });
});

app.post('/resetPassword', function(req, res) {
  if(req.body.password != req.body.confirm_password) {
    res.render('sessions/resetPassword', {errors: {confirm_password: {message: 'No coincide con el password ingresado'}}, user: new User({email: req.body.email})});
    return;
  }
  User.findOne({email: req.body.email}, function(err, user) {
    user.password = req.body.password;
    user.save(function(err) {
      if(err) {
        res.render('sessions/resetPassword', {errors: err.errors, user: new User({email: req.body.email})});
      } else {
        res.redirect('/login');
      }
    });
  });
});

function loggedIn(req, res, next) {
  if(req.user) {
    next();
  } else {
    console.log('User sin loguearse');
    res.redirect('/login');
  }
};

function validateUser(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
    if (err) {
      console.log('Error en validar Usuario');
      res.json({ status: "error", message: err.message, data: null });
    } else {
      console.log('Pasó el usuario: ' + req.body.userId);
      req.body.userId = decoded.id;
      console.log('JWT verify: ' + decoded);
      next();
    }
  });
};

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/token', tokenRouter);
app.use('/bicycles', loggedIn, bicyclesRouter);
app.use('/api/bicycles', validateUser, bicyclesAPIRouter);
app.use('/api/users', usersAPIRouter);
app.use('/api/auth', authRouter);


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
