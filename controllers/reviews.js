const Review = require('../models/review');
const Book = require('../models/book');
module.exports.postReview=async(req,res)=>{
    const book = await Book.findById(req.params.id)
    const review = new Review(req.body.review);
    book.addedBy = await req.user._id
    book.reviews.push(review);
    await review.save();
    await book.save();
    req.flash('success','new review has been added')
    res.redirect(`/books/${book._id}`)
}
module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;
    await Book.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','a review has been deleted')
    res.redirect(`/books/${id}`);
}

