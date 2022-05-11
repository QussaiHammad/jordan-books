const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware');
const User = require('../models/user');
const Book = require('../models/book')
const Cart = require('../models/cart')
const passport = require('passport');



router.post('/add-to-cart/:userid/:bookid',isLoggedIn,async(req,res)=>{
    const userid = req.params.userid
    const bookid = req.params.bookid
    const user = await User.findById(userid).populate('cart')
    const book = await Book.findById(bookid)
    const usercart = await Cart.findById(user.cart)
    if(usercart === null){
        const cart = await  new Cart
        user.cart =  await cart._id
        await   cart.save()
        await   user.save()
        
}
await usercart.books.push(book)
usercart.save()
req.flash('success','you add a book to your cart')
res.redirect('/books')
})

router.delete('/delete/:userid/:cartid/:bookid',async(req,res)=>{
    const cartid = req.params.cartid
    const bookid = req.params.bookid
    const userid= req.params.userid
    await Cart.findByIdAndUpdate(cartid, { $pull: { books: bookid } });
  
    req.flash('success','a book has been remove from your cart')
  
    res.redirect(`/mycart/${userid}`)
})
module.exports = router;

router.get('/:id',isLoggedIn,async(req,res)=>{
    const userid = await req.params.id
    const user = await User.findById(userid).populate('cart')
    const usercart = await Cart.findById(user.cart).populate({
        path: 'books',
        populate: {
            path:'_id',
            path: 'name',
            path: 'image',
            path:'price',
            path:'author'
        }})
let total = 0
for(let books of usercart.books){
    let price=books.price
    total = total + price
}

    res.render('users/myCart',{usercart,total})
})
