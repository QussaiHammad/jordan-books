const { contentSecurityPolicy } = require('helmet');
const Book = require('../models/book.js');
const User = require('../models/user')

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
                path: 'user'
            }
        }).populate('admin')       
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



module.exports.addBook=async(req, res , next)=>{
    const book = new Book(req.body.book)
    book.admin = req.user._id    
    console.log(book)
    await   book.save()
    req.flash('success','new book has been added')
    res.redirect(`/books/${book._id}`)
}



module.exports.updateBook= async(req,res)=>{
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, { ...req.body.book });
    req.flash('success','book has been updated')
    res.redirect(`/books/${book._id}`)
}






module.exports.deleteBook=async(req,res)=>{
    const { id } = req.params
    const book = await Book.findByIdAndDelete(id)
    res.redirect('/books')
}



