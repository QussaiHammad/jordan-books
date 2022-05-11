const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const { render } = require('express/lib/response');
const users = require('../controllers/users')
const {isLoggedIn}= require('../middleware')
const catchAsync = require('../utils/catchAsync');




router.route('/register')
.get(users.showRegister)
.post(catchAsync (users.userRegister))

router.route('/login')
.get(users.showLogin)
.post( passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),users.userLogin)

router.get('/logout',users.userLogout)



module.exports = router;
