const mongoose = require("mongoose");
const ObjId = mongoose.Types.ObjectId;
const Rating = require("../models/RatingModel");
const Order = require("../models/OrderModel");
const Status = require("../models/Status.Model");

const ratingProduct = (userId, orderId, productId, ratingValue) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra nếu người dùng đã đánh giá sản phẩm
      const checkRated = await Rating.findOne({
        customer: new mongoose.Types.ObjectId(userId),
        product: new mongoose.Types.ObjectId(productId),
        order: new mongoose.Types.ObjectId(orderId),
      });

      if (checkRated) {
        // Người dùng đã đánh giá, không thể đánh giá thêm
        reject({
          status: "ERR",
          message:
            "The product has already been rated by this user. You cannot rate it again.",
        });
      } else {
        // Người dùng chưa đánh giá, thêm đánh giá mới
        const ratingQuery = {
          customer: new mongoose.Types.ObjectId(userId),
          product: new mongoose.Types.ObjectId(productId),
          order: new mongoose.Types.ObjectId(orderId),
          rating: ratingValue,
        };

        const newRating = await Rating.create(ratingQuery);
        resolve({
          status: "OK",
          message: "Add rating successful",
          rating: newRating,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateRating = (userId, productId, rating) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkRated = Rating.findOne({
        customer: new ObjId(userId),
        product: new ObjId(productId),
      });
      if (!checkRated) {
        resolve({
          status: "OK",
          message: "The user had not rated this product",
        });
      } else {
        const updatedRating = await Rating.findOneAndUpdate(
          { customer: new ObjId(userId), product: new ObjId(productId) },
          { rating: rating },
          { new: true }
        );

        resolve({
          status: "OK",
          message: "Update rating successful",
          data: updatedRating,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getProductAverageRating = async (productId) => {
  try {
    const result = await Rating.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: "$product", averageRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    if (result.length > 0) {
      return {
        status: "OK",
        averageRating: parseFloat(result[0].averageRating.toFixed(1)), // Làm tròn và chuyển đổi thành số
        count: result[0].count, // Thêm số lượng đánh giá
      };
    } else {
      return {
        status: "OK",
        averageRating: 0,
        count: 0, // Không có đánh giá
        message: "No ratings found for this product",
      };
    }
  } catch (error) {
    console.error("Error in getAverageRating:", error);
    throw error;
  }
};

const checkRating = async (userId, orderId, productId) => {
  try {
    const checkOrder = await Order.findById(orderId);
    
    if (!checkOrder) {
      return {
        status: "ERR",
        message: "Order not found",
      };
    }

    // Lấy status của order trực tiếp thay vì tìm theo _id
    const checkStatus = await Status.findById(checkOrder.status);
    if (!checkStatus) {
      return {
        status: "ERR",
        message: "Status not found",
      };
    }

    if (checkStatus.name === "Đã giao") {
      const checkRated = await Rating.findOne({
        customer: new mongoose.Types.ObjectId(userId),
        product: new mongoose.Types.ObjectId(productId),
        order: new mongoose.Types.ObjectId(orderId),
      });

      if (checkRated) {
        return {
          status: "OK",
          message: "Product has been rated",
          rating: {
            score: checkRated.score, // Giả sử `score` là trường lưu điểm đánh giá
          },
        };
      } else {
        return {
          status: "OK",
          message: "Product has not been rated yet",
        };
      }
    }

    return {
      status: "ERR",
      message: "Order not delivered yet",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const getRatingsByProductId = async (productId) => {
  try {
    // Lấy tất cả đánh giá dựa trên `productId`
    const ratings = await Rating.find({ product: new mongoose.Types.ObjectId(productId) });

    if (ratings.length > 0) {
      return {
        status: "OK",
        message: "Ratings retrieved successfully",
        data: ratings,
      };
    } else {
      return {
        status: "OK",
        message: "No ratings found for this product",
        data: [],
      };
    }
  } catch (error) {
    console.error("Error in getRatingsByProductId:", error);
    throw error;
  }
};
module.exports = {
  ratingProduct,
  updateRating,
  getProductAverageRating,
  checkRating,
  getRatingsByProductId
};
