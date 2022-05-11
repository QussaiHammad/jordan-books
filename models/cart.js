const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    books: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Book'
        }
    ]
});

module.exports = mongoose.model("Cart", cartSchema);