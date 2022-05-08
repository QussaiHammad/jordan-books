const mongoose = require('mongoose');
const Review = require('./review')
const { stringify } = require('nodemon/lib/utils');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    name: String,
    price: Number,
    instock: Number,
    author:String,
    image: String,
    about: String,
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
      {
          type: Schema.Types.ObjectId,
          ref: 'Review'
      }
  ]
  });
  
  BookSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


  module.exports = mongoose.model('Book', BookSchema);