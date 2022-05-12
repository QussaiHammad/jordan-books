const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    carts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Cart'
        }
    ],
    user: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    state:{
        type:String,
        default:'Accepted'
    }
});

module.exports = mongoose.model("Order", orderSchema);