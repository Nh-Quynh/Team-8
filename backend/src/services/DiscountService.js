const Discount = require("../models/DiscountModel");
const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");
const mongoose = require("mongoose");
const ObjId = mongoose.Types.ObjectId;

const createDiscount = async (newDiscount) => {
  try {
    const {
      discountId,
      discountPercent,
      startDate,
      endDate,
      products,
      categories,
    } = newDiscount;
    console.log(newDiscount);
    // Kiểm tra xem các trường bắt buộc có được cung cấp không
    if (!discountId || !discountPercent || !startDate || !endDate) {
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

    // Tạo đối tượng mã giảm giá
    let discountQuery = {
      discountId,
      discountPercent,
      startDate,
      endDate,
    };

    // Kiểm tra và xử lý mảng products
    if (Array.isArray(products) && products.length > 0) {
      // Kiểm tra xem các ID sản phẩm có hợp lệ không
      const productIds = products.map((id) => new mongoose.Types.ObjectId(id));
      const invalidProducts = productIds.filter(
        (id) => !mongoose.Types.ObjectId.isValid(id)
      );

      if (invalidProducts.length > 0) {
        return {
          status: "ERR",
          message: `Invalid product IDs: ${invalidProducts.join(", ")}`,
        };
      }

      // Tìm các sản phẩm trong cơ sở dữ liệu
      const foundProducts = await Product.find({ _id: { $in: productIds } });
      if (foundProducts.length === 0) {
        return {
          status: "ERR",
          message: "No products found matching the provided IDs",
        };
      }

      // Lưu các sản phẩm hợp lệ
      discountQuery.products = foundProducts.map((product) => product._id);
    } else {
      return {
        status: "ERR",
        message: "Products should be a non-empty array",
      };
    }

    // Kiểm tra và xử lý mảng categories
    if (Array.isArray(categories) && categories.length > 0) {
      // Kiểm tra xem các ID danh mục có hợp lệ không
      const categoryIds = categories.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      const invalidCategories = categoryIds.filter(
        (id) => !mongoose.Types.ObjectId.isValid(id)
      );

      if (invalidCategories.length > 0) {
        return {
          status: "ERR",
          message: `Invalid category IDs: ${invalidCategories.join(", ")}`,
        };
      }

      // Tìm các danh mục trong cơ sở dữ liệu
      const foundCategories = await Category.find({
        _id: { $in: categoryIds },
      });

      if (foundCategories.length === 0) {
        return {
          status: "ERR",
          message: "No categories found matching the provided IDs",
        };
      }

      // Lưu các danh mục hợp lệ
      discountQuery.categories = foundCategories.map(
        (category) => category._id
      );
    } else {
      return {
        status: "ERR",
        message: "Categories should be a non-empty array",
      };
    }

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

const getDiscountByProductId = async (productId) => {
  try {
    const currentDate = new Date(); // Lấy ngày hiện tại

    // Tìm sản phẩm với ID productId để lấy danh mục (categories) của nó
    const product = await Product.findOne({ _id: productId }).lean();
    if (!product) {
      return {
        status: "ERR",
        message: "Product not found",
      };
    }

    const productCategories = product.category;

    // Tìm các giảm giá theo sản phẩm
    const productDiscounts = await Discount.find({
      products: productId,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    });

    // Tìm các giảm giá theo danh mục
    const categoryDiscounts = await Discount.find({
      categories: { $in: productCategories },
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    });

    // Gộp 2 mảng mà không loại bỏ trùng lặp
    const combinedDiscounts = [...productDiscounts, ...categoryDiscounts];

    if (combinedDiscounts.length === 0) {
      return {
        status: "ERR",
        message: "No discounts found for this product or its categories",
      };
    }

    return {
      status: "OK",
      message: "Discounts found",
      data: combinedDiscounts,
      categoryDiscounts,

      productDiscounts,
    };
  } catch (error) {
    return {
      status: "ERR",
      message: "Error fetching discounts",
      error: error.message,
    };
  }
};

const getAllDiscount = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // const discounts = await Discount.find().populate("products");
      const discounts = await Discount.find();
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
      // const discount = await Discount.findOne({
      //   _id: discountId,
      // }).populate("products");

      const discount = await Discount.findOne({
        _id: discountId,
      });
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
    const checkDiscount = await Discount.findOne({ _id: discountId });
    if (!checkDiscount) {
      return {
        status: "ERR",
        message: "No discount found",
      };
    }

    // Nếu có sản phẩm trong updatedData, xử lý chúng
    if (
      updatedData.categories &&
      Array.isArray(updatedData.categories) &&
      updatedData.categories.length > 0
    ) {
      const foundCategories = await Product.find({
        _id: { $in: updatedData.categories },
      });
      if (foundCategories.length > 0) {
        const categoryIds = foundCategories.map((category) => category._id);
        updatedData.categories = categoryIds;
      }
    }
    if (
      updatedData.products &&
      Array.isArray(updatedData.products) &&
      updatedData.products.length > 0
    ) {
      const foundProducts = await Product.find({
        _id: { $in: updatedData.products },
      });
      if (foundProducts.length > 0) {
        const productIds = foundProducts.map((product) => product._id);
        updatedData.products = productIds;
      }
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
      { _id: discountId },
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
      const checkDiscount = await Discount.findOne({ _id: discountId });
      // if no discount found, return an error
      if (!checkDiscount) {
        resolve({
          status: "ERR",
          message: "No discount found",
        });
      } else {
        await Discount.findOneAndDelete({ _id: discountId });
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
  getDiscountByProductId,
};
