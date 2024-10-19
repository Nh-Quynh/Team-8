const Category = require("../models/CategoryModel");

const createCategory = async (newCategory) => {
  const { categoryId, name } = newCategory;
  const checkCategory = await Category.findOne({ categoryId });

  try {
    if (checkCategory) {
      return {
        status: "ERR",
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

const updateCategory = async (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findOne({
        _id: id,
      });
      console.log("checkCategory ", checkCategory);
      if (checkCategory == null) {
        resolve({
          status: "ERR",
          message: "The category is not defined",
        });
      }
      const updateCategory = await Category.findByIdAndUpdate(id, data, {
        new: true,
      });
      console.log(" updateCategory", updateCategory);
      resolve({
        status: "OK",
        message: "Update category success",
        data: updateCategory,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCategory = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findOne({
        _id: id, //MongodB sử dụng ID dạng _id
      });
      console.log("Id Service", id);
      if (checkCategory == null) {
        resolve({
          status: "ERR",
          message: "The category is not defined",
        });
      }
      await Category.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete category SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
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

const getCategoryById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategory = await Category.findOne({
        _id: id, //MongodB sử dụng ID dạng _id
      });
      if (checkCategory == null) {
        resolve({
          status: "ERR",
          message: "The category is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "Get category SUCCESS",
        category: checkCategory,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllCategories,
  updateCategory,
  createCategory,
  deleteCategory,
  getCategoryById,
};
