var express        = require('express'),
    bodyParser     = require('body-parser'),
    mongoose       = require('mongoose'),
    methodOverride = require('method-override'),
    app            = express();
    User           = require('./models/user');

// var createError = require('http-errors');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

const connectionString = 'mongodb+srv://kswodeck:Kmswo123!@pocketpoker1-zl3ub.mongodb.net/pocketpoker?retryWrites=true&w=majority';
const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// async function createUser(username) {
//   return new User({
//     username,
//     created: Date.now()
//   }).save()
// }

// async function findUser(username) {
//   return await User.findOne({ username })
// }

// ;(async () => {
//   const connector = mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
//   const username = process.argv[2].split('=')[1];

//   let user = await connector.then(async () => {
//     return findUser(username);
//   })

//   if (!user) {
//     user = await createUser(username);
//   }

//   console.log(user);
//   process.exit(0);
// })();

// app.set('views', path.join(__dirname, 'views'));

// let currentCoins = 0;
// for (let i=0; i<101; i++) {
// User.create({
//   email: "kswodeck@yahoo.com",
//   username: "kswodeck",
//   password: "KrisUser",
//   firstName: "Kristoffer",
//   lastName: "Swodeck",
//   phone: "1234567890",
//   birthday: "09/29/1995",
//   coins: currentCoins
// }, function(err, user) {
//    if (err) {
//      console.log(err);
//   } else {
//      console.log('Created User: ');
//      console.log(user);
// }
// });
// currentCoins++;
// }

// User.create({
//   email: "kmswodeck@gmail.com",
//   username: "kswodeck",
//   password: "KrisUser",
//   firstName: "Kristoffer",
//   lastName: "Swodeck",
//   phone: "1234567890",
//   birthday: "09/29/1995"
// }, function(err, user) {
//    if (err) {
//      console.log(err);
//   } else {
//      console.log('Created User: ');
//      console.log(user);
// }
// });

// var posts = [
//   {title: 'Post 1', author: 'Kris'},
//   {title: 'Post 2', author: 'Michael'},
//   {title: 'Post 3', author: 'Swodeck'},
// ];

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.use(express.static('public'));

// * APP ROUTES *
app.get('/', function(req, res){
  res.render('index', {pageTitle: 'Pocket Poker'});
});
app.get('/cards', function(req, res){
  res.render('cards', {pageTitle: 'Competitive Poker'});
});
app.get('/practice-cards', function(req, res){
  res.render('practice-cards', {pageTitle: 'Practice Poker'});
});
app.get('/leaderboard', function(req, res){
  User.find({}).sort({coins: -1}).exec(function(err, allUsers) {
    if (err) {
      console.log(err);
    } else {
      res.render('leaderboard', {pageTitle: 'Leaderboard', users: allUsers});
    }
  });
});
app.get('/register', function(req, res){
  res.render('register', {pageTitle: 'Create Account'});
});
app.post('/register', function(req, res){
    console.log(req.body.createUser);
    User.create(req.body.createUser, function(err, newlyCreated) {
      if (err) {
        console.log(err);
        res.redirect('/register');
      } else {
        res.redirect('/');
      }
    });
});
app.get('/account', function(req, res){
  res.render('account', {pageTitle: 'My Account'});
});
app.get('/dice', function(req, res){
  res.render('dice', {pageTitle: 'Dice'});
});
app.get('/coin', function(req, res){
  res.render('coin', {pageTitle: 'Coin'});
});

app.listen(port, hostname, function(){
  console.log('App running on ' + hostname + ':' + port)
});

module.exports = app;
