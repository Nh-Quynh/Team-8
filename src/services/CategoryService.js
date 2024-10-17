//CategoryService

const Category = require("../models/CategoryModel");

const createCategory = async (newCategory) => {
  const { categoryId, name } = newCategory;
  const checkCategory = await Category.findOne({ categoryId });

  try {
    if (checkCategory) {
      return {
        status: "OK",
        message: "Category available",
        checkCategory,
      };
    } else {
      const category = await Category.create({
        categoryId,
        name,
      });
      return {
        status: "OK",
        message: "Created new category",
        category,
      };
    }
  } catch (e) {
    // In ra lỗi để dễ debug
    console.error("Error in createCategory service:", e);
    throw new Error(e.message);
  }
};
const getAllCategories = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allCategories = await Category.find();
      resolve({
        status: "OK",
        message: "Get all categories",
        data: allCategories,
      });
    } catch (e) {
      reject(e);
    }
  });
};
// const getCategoryById = async (_id) => {
//   try {
//     const category = await Category.findOne({ _id }); // Tìm loại sản phẩm theo categoryId
//     if (category) {
//       return {
//         status: "OK",
//         message: "Category found",
//         category,
//       };
//     } else {
//       return {
//         status: "ERR",
//         message: "Category not found",
//       };
//     }
//   } catch (e) {
//     console.error("Error in getCategoryById service:", e);
//     throw new Error(e.message);
//   }
// };
module.exports = {
  getAllCategories,
  createCategory,
  // getCategoryById
};
