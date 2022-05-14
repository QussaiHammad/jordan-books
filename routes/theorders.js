const express = require('express');
const order = require('../models/order');
const router = express.Router();
const Order = require('../models/order')
router.get('/',async(req,res)=>{
    const order = await Order.find().populate({
        path: 'carts',
        populate: {
            path: 'books',
        }
    }).populate('user')
    res.render('users/theorders',{order})
})
router.post('/:id',async(req,res)=>{
   const orderid = req.params.id
    const order = await Order.findByIdAndUpdate(orderid,{ state : 'Delivered'})
    res.redirect('/theorders')
})
module.exports = router;