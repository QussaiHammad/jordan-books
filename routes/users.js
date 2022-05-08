const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const { render } = require('express/lib/response');
const users = require('../controllers/users')

const catchAsync = require('../utils/catchAsync');




router.route('/register')
.get(users.showRegister)
.post(catchAsync (users.userRegister))

router.route('/login')
.get(users.showLogin)
.post( passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),users.userLogin)

router.get('/logout',users.userLogout)


router.get('/mycart',(req,res)=>{
    res.render('users/myCart')
})

router.get('/myorders',(req,res)=>{
    res.render('users/myOrders')
})

module.exports = router;
