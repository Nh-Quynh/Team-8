const Discount = require("../models/DiscountModel");
const Product = require("../models/ProductModel");
const mongoose = require("mongoose");
const ObjId = mongoose.Types.ObjectId;

const createDiscount = async (newDiscount) => {
  try {
    const { discountId, discountPercent, startDate, endDate, products } =
      newDiscount;

    // Kiểm tra xem các trường bắt buộc có được cung cấp không
    if (
      !discountId ||
      !discountPercent ||
      !startDate ||
      !endDate ||
      !Array.isArray(products)
    ) {
      return {
        status: "ERR",
        message: "Missing discount attributes or products is not an array",
      };
    }

    // Kiểm tra xem mã giảm giá đã tồn tại chưa
    const checkDiscount = await Discount.findOne({ discountId });
    if (checkDiscount) {
      return {
        status: "ERR",
        message: "The discount has already been created",
      };
    }

    // Tìm tất cả sản phẩm tương ứng từ cơ sở dữ liệu bằng productId
    const foundProducts = await Product.find({ productId: { $in: products } });

    if (foundProducts.length === 0) {
      return { status: "ERR", message: "Not found products" };
    }

    // Lưu chuỗi ObjectId của các sản phẩm
    const productIds = foundProducts.map((product) => product._id); // Lấy _id của từng sản phẩm

    // Kiểm tra và chuyển đổi định dạng ngày từ dd/mm/yyyy sang Date
    const convertDate = (dateStr) => {
      const [day, month, year] = dateStr.split("/");
      if (!day || !month || !year) {
        throw new Error("Invalid date format. Please use dd/mm/yyyy");
      }
      return new Date(`${year}-${month}-${day}`);
    };

    const startDateFormatted = convertDate(startDate);
    const endDateFormatted = convertDate(endDate);

    // Kiểm tra xem startDate có nhỏ hơn hoặc bằng endDate không
    if (startDateFormatted > endDateFormatted) {
      return {
        status: "ERR",
        message: "Start date must be less than or equal to end date",
      };
    }

    // Tạo đối tượng mã giảm giá
    const discountQuery = {
      discountId,
      discountPercent,
      startDate: startDateFormatted,
      endDate: endDateFormatted,
      products: productIds, // Chỉ lưu chuỗi ObjectId
    };

    // Tạo mới mã giảm giá
    const createdDiscount = await Discount.create(discountQuery);
    return {
      status: "OK",
      message: "Created new discount successfully",
      discount: createdDiscount,
    };
  } catch (e) {
    return { status: "ERR", message: e.message || "Internal server error" };
  }
};

const getAllDiscount = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const discounts = await Discount.find().populate("products");

      resolve({
        status: "OK",
        message: "Get all discounts",
        data: discounts,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDiscount = (discountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const discount = await Discount.findOne({
        discountId: discountId,
      }).populate("products");

      resolve({
        status: "OK",
        message: "Get discount by discount id",
        data: discount,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateDiscount = async (discountId, updatedData) => {
  try {
    // Kiểm tra mã giảm giá có tồn tại hay không
    const checkDiscount = await Discount.findOne({ discountId: discountId });
    if (!checkDiscount) {
      return {
        status: "ERR",
        message: "No discount found",
      };
    }

    // Nếu có sản phẩm trong updatedData, xử lý chúng
    if (
      updatedData.products &&
      Array.isArray(updatedData.products) &&
      updatedData.products.length > 0
    ) {
      const foundProducts = await Product.find({
        productId: { $in: updatedData.products },
      });

      if (foundProducts.length === 0) {
        return { status: "ERR", message: "Not found products" };
      }

      // Lưu chuỗi ObjectId của các sản phẩm
      const productIds = foundProducts.map((product) => product._id);
      updatedData.products = productIds; // Cập nhật danh sách sản phẩm
    }

    // Xử lý ngày tháng
    const { startDate, endDate } = updatedData;

    if (startDate) {
      const convertDate = (dateStr) => {
        const [day, month, year] = dateStr.split("/");
        if (!day || !month || !year) {
          throw new Error("Invalid date format. Please use dd/mm/yyyy");
        }
        return new Date(`${year}-${month}-${day}`);
      };

      const startDateFormatted = convertDate(startDate);
      const endDateFormatted = endDate
        ? convertDate(endDate)
        : checkDiscount.endDate;

      if (startDateFormatted > endDateFormatted) {
        return {
          status: "ERR",
          message: "Start date must be less than or equal to end date",
        };
      }

      updatedData.startDate = startDateFormatted;
      updatedData.endDate = endDateFormatted;
    }

    // Cập nhật mã giảm giá với dữ liệu đã cập nhật
    const updatedDiscount = await Discount.findOneAndUpdate(
      { discountId: discountId },
      updatedData,
      { new: true }
    ).populate("products");

    return {
      status: "OK",
      message: "The discount was updated successfully",
      updatedDiscount: updatedDiscount,
    };
  } catch (e) {
    return { status: "ERR", message: e.message || "Internal server error" };
  }
};

const deleteDiscount = (discountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkDiscount = await Discount.findOne({ discountId: discountId });
      // if no discount found, return an error
      if (!checkDiscount) {
        resolve({
          status: "ERR",
          message: "No discount found",
        });
      } else {
        await Discount.findOneAndDelete({ discountId: discountId });
        resolve({
          status: "OK",
          message: "The discount was delete",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createDiscount,
  getAllDiscount,
  getDiscount,
  updateDiscount,
  deleteDiscount,
};
