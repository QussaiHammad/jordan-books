const Book = require('../models/book.js');

module.exports.index = async(req,res)=>{
    const books = await Book.find({}) 
    res.render('books/index',{books})
}

module.exports.newForm = 
    (req, res) => {   
    res.render('books/new');
}



module.exports.showBook =
    async(req,res)=>{
        const book = await Book.findById(req.params.id).populate({
            path: 'reviews',
            populate: {
                path: 'addedBy'
            }
        }).populate({
            path: 'addedBy',
            populate: {
                path: 'username'
            }
        }).populate('addedBy')
        if (!book) {
            req.flash('error', 'Cannot find that book ');
            return res.redirect('/books');
        }
    
        res.render('books/show',{book})
}
module.exports.showEdit= async(req,res)=>{
    const book = await Book.findById(req.params.id)
    res.render('books/edit',{book})
}

    module.exports.updateBook= async(req,res)=>{
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, { ...req.body.book });
    req.flash('success','book has been updated')
    res.redirect(`/books/${book._id}`)}

module.exports.deleteBook=async(req,res)=>{
    const { id } = req.params
    const book = await Book.findByIdAndDelete(id)
    res.redirect('/books')
}