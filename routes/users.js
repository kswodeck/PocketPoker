var express = require('express');
var passport = require('passport'),
    router   = express.Router({mergeParams: true}),
    moment   = require('moment'),
    User     = require('../models/user');

router.get('/cards', isLoggedIn, function(req, res){
  res.render('cards', {pageTitle: 'Competitive Poker', storedCoins: req.user.coins});
});
router.put('/cards', isLoggedIn, function(req, res){
    if (req.body.userCoins != req.user.coins) { //update coins
    console.log('updating coins: ' + req.user.coins + ' to ' + req.body.userCoins);
    User.findOneAndUpdate({username: req.user.username}, {$set: {coins: req.body.userCoins}}, {useFindAndModify: false, rawResult: true}, function(req, res){});
    }
    if (req.body.currentWin > req.user.highestWin) { //update highestWin
      console.log('updating highestWin: ' + req.user.highestWin + ' to ' + req.body.currentWin);
      User.findOneAndUpdate({username: req.user.username}, {$set: {highestWin: req.body.currentWin}}, {useFindAndModify: false, rawResult: true}, function(req, res){});
    }
  return res.status(204).send(); //this works in ending the request
});

router.get('/leaderboard', isLoggedIn, function(req, res){
  User.find({}).sort({coins: -1}).exec(function(err, allUsers) {
    if (err) {
      return console.log(err);
    } else {
      return res.render('leaderboard', {pageTitle: 'Leaderboard', users: allUsers});
    }
  });
});

router.get('/register', isLoggedOut, function(req, res){
  res.render('register', {pageTitle: 'Create Account', error: false});
});
router.post('/register', isLoggedOut, function(req, res){
  let momentBirthday =  getLocalNoonDate(req.body.createUser.birthday);
  //don't allow already existing usernames or emails
  var newUser = new User({email: req.body.createUser.email, username: req.body.username, firstName: req.body.createUser.firstName, lastName: req.body.createUser.lastName, phone: req.body.createUser.phone, birthday: momentBirthday});
  // try refactor to req.body.createUser, no curly braces
  // var newUser = new User({username: req.body.username}, req.body.createUser);
  User.register(newUser, req.body.password, function(err, user){
      if(err){
        console.log("Error: " + err);
        res.render('register', {pageTitle: 'Create Account', isLoggedIn: false, error: true, message: err.message});
      }
      console.log(user);
      passport.authenticate('local')(req, res, function(){
        return res.redirect('/');
      });
  });
  return res.status(204).send(); //this works in ending the request
});

router.get('/login', isLoggedOut, function(req, res){
  res.render('login', {pageTitle: 'Login'});
});
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}), function(req, res){ // try implementing error message on failed login
  return;
});
router.get('/logout', isLoggedIn, function(req, res){
  req.logout();
  res.render('index', {pageTitle: 'Pocket Poker', fromLogout: true});
});

router.get('/account', isLoggedIn, function(req, res){
  if (req.user) {
  let formattedBirthday = formatDate(req.user.birthday);
  return res.render('account', {pageTitle: 'My Account', birthday: formattedBirthday, error: false});
  }
  return res.redirect('/login');
});
router.put('/account', isLoggedIn, function(req, res){
  const curUser = req.user, updated = req.body.updateUser;
  const formattedBirthday = formatDate(curUser.birthday);
  if (req.body.updatePassword) {
    curUser.changePassword(req.body.oldPassword, req.body.updatePassword, function(err, user) { // will use email instead
      if(err){
        // let errStr = err.message.toString();
        // let errStr1 = errStr.slice(0, 8);
        // let message = errStr1 + ' is incorrect';
        // console.log(message);
        res.status(204).send(); //this works in ending the request
      } else {
        console.log('Password changed to: ' + req.body.updatePassword);
        // res.render('account', {pageTitle: 'My Account', birthday: formattedBirthday, fromAccount: false, error: true, message: 'Account has been updated'});
        return res.redirect('/account'); // implement 'Account has been updated' message
      }
  });
} else {
  compareEachAccountInput(req, res, formattedBirthday, curUser, updated.firstName, curUser.firstName, 'firstName');
  compareEachAccountInput(req, res, formattedBirthday, curUser, updated.lastName, curUser.lastName, 'lastName');
  compareEachAccountInput(req, res, formattedBirthday, curUser, updated.email, curUser.email, 'email');
  compareEachAccountInput(req, res, formattedBirthday, curUser, updated.username, curUser.username, 'username');
  compareEachAccountInput(req, res, formattedBirthday, curUser, updated.phone, curUser.phone, 'phone');
  compareEachAccountInput(req, res, formattedBirthday, curUser, updated.birthday, formattedBirthday, 'birthday');
  return res.redirect('/account'); // implement 'Account has been updated' message
}
// return res.status(204).send(); //this works in ending the request
});
function compareEachAccountInput(req, res, formattedBirthday, user, formValue, storedValue, valueName){
  if (formValue != storedValue) {
    if (valueName == 'firstName') {
      User.findOneAndUpdate({username: user.username}, {$set: {firstName: formValue}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){});
    } else if (valueName == 'lastName') {
      User.findOneAndUpdate({username: user.username}, {$set: {lastName: formValue}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){});
    } else if (valueName == 'email') {
      User.find({email: formValue}, function(err, result) {
        if (err || result.length > 0) {
          let errMsg = valueName + ' already exists';
          console.log('Num Results: ' + result.length + ', Error: ' + err);
          // return res.render('account', {pageTitle: 'My Account', birthday: formattedBirthday, fromAccount: false, error: true, message: errMsg});
          // return res.redirect('/account'); // implement error message
        } else {
          User.findOneAndUpdate({username: user.username}, {$set: {email: formValue}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){});
        }
      });
    } else if (valueName == 'username') {
      User.find({username: formValue}, function(err, result) {
        if (err || result.length > 0) {
          let errMsg = valueName + ' already exists';
          console.log('Num Results: ' + result.length + ', Error: ' + err);
          // return res.render('account', {pageTitle: 'My Account', birthday: formattedBirthday, fromAccount: false, error: true, message: errMsg});
          // return res.redirect('/account'); // implement error message
        } else {
          User.findOneAndUpdate({username: user.username}, {$set: {username: formValue}}, {runValidators: true, useFindAndModify: false, rawResult: true}, function(req, res){});
        }
      });
    } else if (valueName == 'phone') {
      User.findOneAndUpdate({username: user.username}, {$set: {phone: formValue}}, {useFindAndModify: false, rawResult: true}, function(req, res){});
    } else if (valueName == 'birthday') {
      let momentBirthday =  getLocalNoonDate(formValue);
      User.findOneAndUpdate({username: user.username}, {$set: {birthday: momentBirthday}}, {useFindAndModify: false, rawResult: true}, function(req, res){});
    }
      return console.log('Update attempt, ' + valueName + ': ' + storedValue + ' to ' + formValue);
  } else {
    return console.log('values are equal');
  }
}

router.get('/forgotuser', isLoggedOut, function(req, res){ // try implementing error message on failure
  return res.render('forgotuser', {pageTitle: 'Forgot Username', message: false});
});
router.post('/forgotuser', function(req, res){ // try implementing error message on failure
  let userBirthday = req.body.forgotUser.birthday;
  console.log('email: ' + req.body.forgotUser.email + ', birthday: ' + userBirthday);
  User.find({email: req.body.forgotUser.email}, function(err, users) {
    if (err || users.length < 1) {
      console.log("email doesn't exist");
    } else {
      console.log('NumUsers: ' + users.length);
      for (let i = 0; i < users.length; i++) {
        console.log('user ' + i + ' birthday: ' + users[i].birthday);
        let storedBirthday = formatDate(users[i].birthday);
        console.log('storedBirthday: ' + storedBirthday + ', userBirthday: ' + userBirthday);
        if (storedBirthday.includes(userBirthday)) {
          console.log('match found');
          let msg = 'Username: ' + users[i].username;
          return res.render('forgotuser', {pageTitle: 'Forgot Username', message: msg});
        } else {
          console.log('not a match');
        }
      }
      // return res.redirect('/forgotuser');
    }
    return res.render('forgotuser', {pageTitle: 'Forgot Username', message: 'No match found'});
  });
  return;
});

router.get('/forgotpass', isLoggedOut, function(req, res){ // try implementing error message on failure
  return;
});
router.post('/forgotpass', function(req, res){ // try implementing error message on failure
  return;
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect('/login');
}
function isLoggedOut(req, res, next){
  if(!req.isAuthenticated()){
      return next();
  }
  res.redirect('/');
}

function getLocalNoonDate(date) {
  let adjustedTime = 12 + (moment().utcOffset()/60);
  let inputDate = date + ' ' + adjustedTime + ':00';
  return moment().format(inputDate);
}

function formatDate(date) {
  let unformattedDate = date.toString();
  let formattedYear = unformattedDate.slice(11, 15);
  let formattedMonth = unformattedDate.slice(4, 7);
  formattedMonth = getMonthNum(formattedMonth);
  let formattedDay = unformattedDate.slice(8, 10);
  let formattedDate = formattedYear + '-' + formattedMonth + '-' + formattedDay;
  return formattedDate;
}

function getMonthNum(month) {
  month === 'Jan' ? month = '01' : month === 'Feb' ? month = '02' : month === 'Mar' ? month = '03' : month === 'Apr' ? month = '04' :
  month === 'May' ? month = '05' : month === 'Jun' ? month = '06' : month === 'Jul' ? month = '07' :  month === 'Aug' ? month = '08' :
  month === 'Sep' ? month = '09' : month === 'Oct' ? month = '10' : month === 'Nov' ? month = '11' : month = '12';
  return month;
}

module.exports = router;
