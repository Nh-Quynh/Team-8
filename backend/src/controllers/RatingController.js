const RatingService = require('../services/RatingService')

// add rating with data from request body
const ratingProduct = async (req, res) => {
  try {
      console.log(req.body); // In toàn bộ req.body để kiểm tra

      const { userId, productId, rating } = req.body;

      if (!userId || !productId || rating === undefined) {
          return res.status(400).json({
              status: 'ERR',
              message: 'userId, productId, and rating are required'
          });
      }

      console.log("User ID:", userId);
      console.log("Product ID:", productId);
      console.log("Rating Value:", rating);

      if (rating < 0 || rating > 5) {
          return res.status(404).json({
              status: 'ERR',
              message: 'Rating value is in range [0, 5]'
          });
      }

      const response = await RatingService.ratingProduct(userId, productId, rating);
      return res.status(200).json(response);

  } catch (e) {
      console.error("Error:", e); // Log lỗi để dễ theo dõi
      return res.status(500).json({
          message: 'Internal server error'
      });
  }
};



// update rating with data from request body
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

// Hàm để tính rating trung bình của một sản phẩm
const getProductAverageRating = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log("Received productId:", productId); // Kiểm tra productId nhận được

    const response = await RatingService.getProductAverageRating(productId);
    console.log("Average Rating Response:", response); // Kiểm tra phản hồi từ service

    return res.status(200).json(response);
  } catch (e) {
    console.error("Error in getProductAverageRating:", e); // Log lỗi ra console
    return res.status(400).json({ message: e });
  }
};


module.exports = {
    ratingProduct,
    updateRating,
    getProductAverageRating
}