const express = require('express');
const router = express.Router();
const Book = require('../models/book.js');
const User = require('../models/user.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {bookSchema}= require('../sc')
const {isLoggedIn , validateBook,isAdmin}= require('../middleware')
const books = require('../controllers/books')
const passport = require('passport');



router.route('/')
.get(catchAsync(books.index))
.post(isLoggedIn,catchAsync(books.addBook))


router.get('/new', isAdmin,isLoggedIn , books.newForm)
router.route('/:id')
.get(catchAsync(books.showBook))
.put(isLoggedIn,validateBook,catchAsync(books.updateBook))
.delete(isLoggedIn,catchAsync(books.deleteBook))


router.get('/:id/edit',isLoggedIn,catchAsync(books.showEdit))





module.exports = router;