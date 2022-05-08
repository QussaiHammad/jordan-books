const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Book = require('../models/book.js');
const User = require('../models/user.js');
const {bookSchema}= require('../sc')
const {isLoggedIn}= require('../middleware')
const books = require('../controllers/books')

const validateBook= (req, res, next) => {
    const { error } = bookSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.route('/')
.get(catchAsync(books.index))
.post(validateBook  ,catchAsync(books.newBook))

router.get('/new', isLoggedIn , books.newForm)

router.route('/:id')
.get(catchAsync(books.showBook))
.put(isLoggedIn,validateBook,catchAsync(books.updateBook))
.delete(isLoggedIn,catchAsync(books.deleteBook))



router.get('/:id/edit',isLoggedIn,catchAsync(books.showEdit))





module.exports = router;