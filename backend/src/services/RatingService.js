const mongoose = require("mongoose");
const ObjId = mongoose.Types.ObjectId;
const Rating = require('../models/RatingModel');

const ratingProduct = (userId, productId, ratingValue) => {
    return new Promise(async (resolve, reject) => {
      try {
        // if user had rated the, return
        const checkRated = Rating.findOne({customer: new ObjId(userId), product: new ObjId(productId)})
        if (checkRated)
        {
            resolve({
                status: 'OK',
                message: 'The product already had rated by this user'
            })
        }
        else
        {
            const ratingQuery = {
                customer: userId,
                product: productId,
                rating: ratingValue
            }

            const newRating = await Rating.create(ratingQuery)
            resolve({
                status: 'OK',
                message: 'Add rating successful',
                rating: newRating
            })
        }

      } catch(e)
      {
        reject(e)
      }
    })
}  

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

module.exports = {
    ratingProduct,
    updateRating,
}