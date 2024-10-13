const RatingService = require('../services/RatingService')

const ratingProduct = async (req, res) => {
  try {
    const {userId, productId, rating } = req.body;

    // check rating value
    if (rating < 0 || rating > 5) {
      return res.status(404).json({
        status: 'ERR',
        message: 'Rating value is in range [0, 5]'
      })
    } else {
      const response = await RatingService.ratingProduct(userId, productId, rating);

      return res.status(200).json(response);
    }
  } catch(e) {
    return res.status(404).json({
      message: e
    });
  }
};  

const updateRating = async (req, res) => {
  try {
    const {userId, productId, rating } = req.body;

    // check rating value
    if (rating < 0 || rating > 5) {
      return res.status(404).json({
        status: 'ERR',
        message: 'Rating value is in range [0, 5]'
      })
    }
    else {
      const response = await RatingService.updateRating(userId, productId, rating);

      return res.status(200).json(response);
    }
  } catch(e) {
    return res.status(404).json({
      message: e
    })
  }
}

module.exports = {
    ratingProduct,
    updateRating,
}