const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    id: Number,
    userName: String,
    email: String,
    rating: Number,
    comment: String,
    date: Date
});

const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    oldPrice: Number,
    description: String,
    detailDescription: String,
    category: String,
    frenchCategory: String,
    image: String,
    images: [String],
    inStock: Boolean,
    quantity: Number,
    rating: Number,
    reviewCount: Number,
    material: String,
    dimensions: String,
    weight: String,
    features: [String],
    style: String,
    occasion: String,
    warranty: String,
    careInstructions: String,
    reviews: [reviewSchema]
});

module.exports = mongoose.model('Product', productSchema);
