const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    location: String,
    cart: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Cart'
        }
    ],
    order: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);


