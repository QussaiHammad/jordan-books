const Joi = require('joi');

module.exports.bookSchema = Joi.object({
    book : Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required().min(0),
        instock:Joi.number().required().min(0),
        author:Joi.string().required(),
        image: Joi.string().required(),
        about: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})


