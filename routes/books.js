const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Book = require('../models/book.js');
const User = require('../models/user.js');
const {bookSchema}= require('../sc')
const {isLoggedIn , validateBook}= require('../middleware')
const books = require('../controllers/books')

// const validateBook= (req, res, next) => {
//     console.log(req.body.book)
//     const { error } = bookSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }


router.route('/')
.get(catchAsync(books.index))



// app.post('/',async(req, res,next)=>{
//     const book = new Book(req.body.book)
//     console.log(req.body.book)
//     //   book.addedBy =  req.user._id
//     await   book.save()
//     req.flash('success','new book has been added')
//     res.redirect(`/books/${book._id}`)
// })

router.get('/theorders',isLoggedIn,catchAsync((req,res)=>{
    res.render('books/theOrders')
}))

router.get('/new', isLoggedIn , books.newForm)
router.route('/:id')
.get(catchAsync(books.showBook))
.put(isLoggedIn,validateBook,catchAsync(books.updateBook))
.delete(isLoggedIn,catchAsync(books.deleteBook))



router.get('/:id/edit',isLoggedIn,catchAsync(books.showEdit))





module.exports = router;