const mongoose = require("mongoose");
const ObjId = mongoose.Types.ObjectId;
const Rating = require('../models/RatingModel');

const ratingProduct = (userId, productId, ratingValue) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra nếu người dùng đã đánh giá sản phẩm
            const checkRated = await Rating.findOne({
                customer: new mongoose.Types.ObjectId(userId),
                product: new mongoose.Types.ObjectId(productId)
            });
            
            if (checkRated) {
                // Người dùng đã đánh giá, không thể đánh giá thêm
                reject({
                    status: 'ERR',
                    message: 'The product has already been rated by this user. You cannot rate it again.'
                });
            } else {
                // Người dùng chưa đánh giá, thêm đánh giá mới
                const ratingQuery = {
                    customer: new mongoose.Types.ObjectId(userId),
                    product: new mongoose.Types.ObjectId(productId),
                    rating: ratingValue
                };

                const newRating = await Rating.create(ratingQuery);
                resolve({
                    status: 'OK',
                    message: 'Add rating successful',
                    rating: newRating
                });
            }

        } catch (e) {
            reject(e);
        }
    });
};


const updateRating = (userId, productId, rating) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkRated = Rating.findOne({customer: new ObjId(userId), product: new ObjId(productId)})
            if (!checkRated)
            {
                resolve({
                    status: 'OK',
                    message: 'The user had not rated this product'
                })
            } else {
                const updatedRating = await Rating.findOneAndUpdate(
                    {customer: new ObjId(userId), product: new ObjId(productId)}, 
                    {rating: rating}, 
                    {new: true})

                resolve({
                    status: 'OK',
                    message: 'Update rating successful',
                    data: updatedRating
                })
            }
        } catch(e) {
            reject(e)
        }
    })
}

const getProductAverageRating = async (productId) => {
    try {
        const result = await Rating.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(productId) } },
            { $group: { _id: "$product", averageRating: { $avg: "$rating" } } }
        ]);

        return result.length > 0
            ? { status: 'OK', averageRating: result[0].averageRating }
            : { status: 'OK', averageRating: 0, message: 'No ratings found for this product' };

    } catch (error) {
        console.error("Error in getAverageRating:", error);
        throw error;
    }
};

module.exports = {
    ratingProduct,
    updateRating,
    getProductAverageRating
}