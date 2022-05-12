const express = require('express');
const router = express.Router();
const Order = require('../models/order')

const User = require('../models/user')
router.get('/:userid',async(req,res)=>{
    const userid = req.params.userid
    const user = await User.findById(userid).populate({
        path: 'order',
        populate: {
            path: 'carts',
            populate: {
                path: 'books'
            }
        }
    })

    res.render('users/myOrders',{user})
})

module.exports = router;