const express= require('express')
const router = express.Router({ mergeParams: true })
const {reviewSchema}= require('../sc')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const Book = require('../models/book.js');
const {isLoggedIn}= require('../middleware')
const reviews = require('../controllers/reviews')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.post('/',validateReview ,isLoggedIn,catchAsync(reviews.postReview))

router.delete('/:reviewId',isLoggedIn, catchAsync(reviews.deleteReview))


module.exports = router;