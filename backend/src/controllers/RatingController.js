const Rating = require("../models/RatingModel");
const RatingService = require("../services/RatingService");
const mongoose = require('mongoose');

// add rating with data from request body
const ratingProduct = async (req, res) => {
  try {
    console.log(req.body); // In toàn bộ req.body để kiểm tra

    const { userId, orderId, productId, rating } = req.body;

    if (!userId || !productId || rating === undefined) {
      return res.status(400).json({
        status: "ERR",
        message: "userId, productId, and rating are required",
      });
    }
    if (rating < 0 || rating > 5) {
      return res.status(404).json({
        status: "ERR",
        message: "Rating value is in range [0, 5]",
      });
    }

    const response = await RatingService.ratingProduct(
      userId,
      orderId,
      productId,
      rating
    );
    return res.status(200).json(response);
  } catch (e) {
    console.error("Error:", e); // Log lỗi để dễ theo dõi
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// update rating with data from request body
const updateRating = async (req, res) => {
  try {
    const { userId, productId, rating } = req.body;

    // check rating value
    if (rating < 0 || rating > 5) {
      return res.status(404).json({
        status: "ERR",
        message: "Rating value is in range [0, 5]",
      });
    } else {
      const response = await RatingService.updateRating(
        userId,
        productId,
        rating
      );

      return res.status(200).json(response);
    }
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

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

//Ham check truoc khi goi rating
const checkRating = async (req, res) => {
  try {
    const { userId, orderId, productId } = req.params;
    const response = await RatingService.checkRating(userId, orderId, productId);

    // Nếu sản phẩm đã được đánh giá, trả về thông báo rõ ràng
    if (response.status === "ERR") {
      return res.status(400).json({
        status: "ERR",
        message: response.message,
      });
    }

    // Nếu không có lỗi, tìm kiếm đánh giá cho sản phẩm
    const ratingDetails = await Rating.findOne({
      customer: new mongoose.Types.ObjectId(userId),
      product: new mongoose.Types.ObjectId(productId),
      order: new mongoose.Types.ObjectId(orderId),
    });

    if (ratingDetails) {
      return res.status(200).json({
        status: "OK",
        message: "Product has been rated",
        rating: {
          score: ratingDetails.rating, // Giả sử `score` là trường lưu điểm đánh giá
        },
      });
    } else {
      return res.status(200).json({
        status: "OK",
        message: "Product has not been rated yet", // Thông báo rằng sản phẩm chưa được đánh giá
      });
    }
  } catch (error) {
    console.error("Error in checkRating:", error);
    return res.status(500).json({ message: error.message || 'An internal server error occurred' });
  }
};

const getRatingsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log("Fetching ratings for productId:", productId); // Log để kiểm tra productId

    const ratings = await Rating.find({ product: new mongoose.Types.ObjectId(productId) })
      .populate('customer', 'name') // Tùy chọn: Chỉ lấy tên khách hàng từ thông tin người dùng
      .select('rating comment createdAt'); // Chỉ lấy trường cần thiết

    if (!ratings || ratings.length === 0) {
      return res.status(200).json({
        status: "OK",
        message: "No ratings found for this product",
        ratings: [],
      });
    }

    return res.status(200).json({
      status: "OK",
      ratings,
    });
  } catch (error) {
    console.error("Error in getRatingsByProductId:", error);
    return res.status(500).json({
      status: "ERR",
      message: "Internal server error",
    });
  }
};
module.exports = {
  ratingProduct,
  updateRating,
  getProductAverageRating,
  checkRating,
  getRatingsByProductId
};
