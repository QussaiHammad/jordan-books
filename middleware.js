const { bookSchema, reviewSchema } = require('./sc.js');
const ExpressError = require('./utils/ExpressError');
const Book = require('./models/book');
const Review = require('./models/review');
const passport = require('passport');
const User =require('./models/user');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be login in first!');
        return res.redirect('/login');
    }
    next();
}
module.exports.validateBook= (req, res, next) => {
    console.log(req.body.book)
    const { error } = bookSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAdmin = async(req, res, next) => {
    // const { id } = req.params;
    // const user = await User.findById()
    // // if (!user.id.equals('62776cc9140c26f85f22350a')) {
        
    // //     req.flash('error', 'You are not admin');
    // //     return res.redirect('/books');
    // // }
    // console.log(user._id)
    next();
}