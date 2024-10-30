const mongoose = require("mongoose");
const Product = require("../models/ProductModel");
const Customer = require("../models/CustomerModel");
const Category = require("../models/CategoryModel");
const Color = require("../models/ColorModel");
const Quantity = require("../models/QuantityModel");
const Material = require("../models/MaterialModel");
const Cart = require("../models/CartModel");
const ObjectId = mongoose.Types.ObjectId;

const ObjId = require("mongoose").Types.ObjectId;
//Tao san pham
const createProduct = async (newProduct) => {
  const {
    productId,
    name,
    price,
    description,
    urlImage,
    categoryId,
    materialId,
    color,
    quantity,
  } = newProduct;

  try {
    // Kiểm tra xem sản phẩm có tồn tại không
    let product = await Product.findOne({ productId });
    let categoryObj = await Category.findById({ categoryId });
    let colorObj = await Color.findOne({
      name: { $regex: new RegExp(`^${color}$`, "i") },
    });
    // let colorObj = await Color.findOne({ name: color });
    let materialObj = await Material.findById({ materialId });
    // Nếu category , material chưa tồn tại báo lỗi
    if (!categoryObj) {
      return {
        status: "ERR",
        massage: "Unavailable category",
      };
    } else if (!materialObj) {
      return {
        status: "ERR",
        massage: "Unavailable material",
      };
    }

    if (!colorObj) colorObj = await Color.create({ name: color });

    // Nếu sản phẩm đã tồn tại
    if (product) {
      let existingQuantity = await Quantity.findOne({
        product: product._id,
        color: colorObj._id,
      });

      if (existingQuantity) {
        // Cập nhật số lượng sản phẩm
        existingQuantity.quantity =
          Number(existingQuantity.quantity) + Number(quantity);
        // existingQuantity.quantity += quantity
        await existingQuantity.save();
        return {
          status: "OK",
          message: "Updated existing product quantity",
          product,
          updateQuantity: existingQuantity,
        };
      } else {
        // Tạo mới quantity cho sản phẩm
        const newQuantity = await Quantity.create({
          product: product._id,
          color: colorObj._id,
          quantity,
        });
        return {
          status: "OK",
          message: "Created new quantity for existing product",
          product,
          quantity: newQuantity,
        };
      }
    }

    // Nếu sản phẩm chưa tồn tại, tiến hành tạo sản phẩm mới
    product = await Product.create({
      productId,
      name,
      price,
      description,
      urlImage,
      category: categoryObj._id,
      material: materialObj._id,
    });

    // Tạo mới quantity cho sản phẩm mới
    const newQuantity = await Quantity.create({
      product: product._id,
      color: colorObj._id,
      quantity,
    });

    return {
      status: "OK",
      message: "Created new product with quantity",
      product,
      quantity: newQuantity,
    };
  } catch (e) {
    // In ra lỗi để dễ debug
    console.error("Error in createProduct service:", e);
    throw new Error(e.message);
  }
};

//Cap nhat san pham
const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      console.log("checkProduct ", checkProduct);
      if (checkProduct == null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }
      const updateProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });
      console.log("updateProduct", updateProduct);
      resolve({
        status: "OK",
        message: "Update product success",
        data: updateProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id, //MongodB sử dụng ID dạng _id
      });
      console.log("Id Service", id);
      if (checkProduct == null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }
      await Product.findByIdAndDelete(id);
      await Quantity.findOneAndDelete({ product: id });
      resolve({
        status: "OK",
        message: "Delete product SUCCESS",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getProductById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: id, //MongodB sử dụng ID dạng _id
      });
      if (!product) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "Get product SUCCESS",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.find();
      if (!product) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "Get all product SUCCESS",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const productCountByCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Sử dụng aggregate để nhóm và đếm sản phẩm theo loại
      const productsCount = await Product.aggregate([
        {
          $group: {
            _id: "$category", // Nhóm theo categoryId
            count: { $sum: 1 }, // Đếm số lượng sản phẩm trong mỗi nhóm
          },
        },
        {
          $lookup: {
            from: "categories", // Tên bảng category trong cơ sở dữ liệu
            localField: "_id",
            foreignField: "_id",
            as: "category", // Lưu thông tin loại vào trường category
          },
        },
        {
          $unwind: "$category", // Giải nén mảng category
        },
        {
          $project: {
            _id: 0,
            categoryId: "$category._id", // Lấy categoryId
            categoryName: "$category.name", // Lấy tên loại
            count: 1, // Số lượng sản phẩm
          },
        },
      ]);

      if (!productsCount || productsCount.length === 0) {
        resolve({
          status: "ERR",
          message: "No products found",
        });
      } else {
        resolve({
          status: "OK",
          message: "Get product count by category SUCCESS",
          data: productsCount,
        });
      }
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message || "An error occurred while fetching data",
      });
    }
  });
};
const getAllProducts = (limit, page, sort) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();

      // sort products
      if (sort) {
        const objSort = {};
        objSort[sort[1]] = sort[0];
        const allProductSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objSort);
        resolve({
          status: "OK",
          message: "Get all product",
          data: allProductSort,
          total: totalProduct,
          currentPage: Number(page) + 1,
          totalPage: Math.ceil(totalProduct / limit),
        });
      }

      // get all products
      const allProduct = await Product.find()
        .limit(limit)
        .skip(page * limit);
      resolve({
        status: "OK",
        message: "Get all product",
        data: allProduct,
        total: totalProduct,
        currentPage: Number(page) + 1,
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

// const fillByMaterial = async (materialId, limit, page) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             // mongoose debug tools
//             // mongoose.set('debug', true)

//             const query = {'material': new ObjId(materialId)}
//             const products = await Product.find(query).populate('material').populate('category').limit(limit).skip(page * limit)
//             const totalProduct = await Product.countDocuments(query)

//             resolve(
//                 {
//                     status: 'OK',
//                     message: 'Get filled products',
//                     data: products,
//                     total: totalProduct,
//                     currentPage: Number(page) + 1,
//                     totalPage: Math.ceil(totalProduct / limit)
//                 }
//             )
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

// const fillByCategory = async (categoryId, limit, page) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             // mongoose debug tools
//             // mongoose.set('debug', true)

//             const query = {'category': new ObjId(categoryId)}
//             const products = await Product.find(query).populate('material').populate('category').limit(limit).skip(page * limit)
//             const totalProduct = await Product.countDocuments(query)

//             resolve(
//                 {
//                     status: 'OK',
//                     message: 'Get filled products',
//                     data: products,
//                     total: totalProduct,
//                     currentPage: Number(page) + 1,
//                     totalPage: Math.ceil(totalProduct / limit)
//                 }
//             )
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

const fillProducts = async (categoryId, materialId, limit, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      // mongoose debug tools
      // mongoose.set("debug", true);

      var query;

      if (categoryId === undefined) {
        query = { material: new ObjId(materialId) };
      } else if (materialId === undefined) {
        query = { category: new ObjId(categoryId) };
      } else {
        query = {
          category: new ObjId(categoryId),
          material: new ObjId(materialId),
        };
      }

      const products = await Product.find(query)
        .populate("material")
        .populate("category")
        .limit(limit)
        .skip(page * limit);
      const totalProduct = await Product.countDocuments(query);

      resolve({
        status: "OK",
        message: "Get filled products",
        data: products,
        total: totalProduct,
        currentPage: Number(page) + 1,
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const searchProducts = (keyword, limit, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 'regex' helps in case searching for part of product name
      // options: i helps in case insensitive search
      const products = await Product.find({
        name: { $regex: keyword, $options: "i" },
      })
        .limit(limit)
        .skip(page * limit);
      const totalProduct = await Product.countDocuments({
        name: { $regex: keyword },
      });

      resolve({
        status: "OK",
        message: "Get filled products",
        data: products,
        total: totalProduct,
        currentPage: Number(page) + 1,
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getQuantity = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const quantities = await Quantity.find({
        product: productId, //MongodB sử dụng ID dạng _id
      });
      if (quantities.length === 0) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      } else {
        resolve({
          status: "OK",
          message: "Get quantity SUCCESS",
          data: quantities, // Trả về dữ liệu số lượng
        });
      }
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message, // Trả về lỗi nếu có
      });
    }
  });
};
const updateQuantity = (id, quantity) => {
  return new Promise(async (resolve, reject) => {
    try {
      const quantityProduct = await Quantity.findById(id);
      // Kiểm tra xem bản ghi có tồn tại không
      if (!quantityProduct) {
        return resolve({
          status: "ERR",
          message: "The quantity product is not defined",
        });
      }
      const updatedProduct = await Quantity.findByIdAndUpdate(
        id,
        { quantity: quantity },
        { new: true } // Tùy chọn này sẽ trả về bản ghi đã được cập nhật
      );
      // console.log(id, quantity + "Đã được gửi đi");
      resolve({
        status: "OK",
        message: "Quantity updated successfully",
        data: updatedProduct,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message, // Trả về lỗi nếu có
      });
    }
  });
};
const createQuantity = (newQuantity) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { color, quantity, productId } = newQuantity;
      // Kiểm tra tính hợp lệ của productId
      let productObj = await Product.findOne({ _id: productId });
      let colorObj = await Color.findOne({
        name: { $regex: new RegExp(`^${color}$`, "i") },
      });
      if (!colorObj) colorObj = await Color.create({ name: color });

      const quantityProduct = await Quantity.findOne({
        color: colorObj._id,
        product: productObj._id,
      });
      // Kiểm tra xem bản ghi có tồn tại không
      if (quantityProduct) {
        return resolve({
          status: "ERR",
          message: "The quantity is available",
          quantityProduct,
        });
      }

      const quantityObj = await Quantity.create({
        product: productObj._id,
        color: colorObj._id,
        quantity,
      });
      resolve({
        status: "OK",
        message: "Create quantity successfully",
        data: quantityObj,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message, // Trả về lỗi nếu có
      });
    }
  });
};

const deleteQuantity = (quantityId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm và xóa bản ghi Quantity dựa trên colorId và productId
      const result = await Quantity.findByIdAndDelete(quantityId);

      // Kiểm tra xem bản ghi có tồn tại không
      if (!result) {
        return resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      // Trả về thông báo thành công
      resolve({
        status: "OK",
        message: "Quantity deleted successfully",
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message, // Trả về lỗi nếu có
      });
    }
  });
};

const getColorById = (colorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const color = await Color.findOne({
        _id: colorId, //MongodB sử dụng ID dạng _id
      });
      if (!color) {
        resolve({
          status: "ERR",
          message: "The color is not defined",
        });
      } else {
        resolve({
          status: "OK",
          message: "Get color SUCCESS",
          data: color, // Trả về dữ liệu số lượng
        });
      }
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message, // Trả về lỗi nếu có
      });
    }
  });
};
const getAllColor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const getAllColor = await Color.find();
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: getAllColor,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const addProductToCart = (userId, quantityId, quantityToAdd) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra khách hàng
      const customer = await Customer.findById(userId);
      if (!customer) {
        return resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }

      // Kiểm tra số lượng tồn kho
      const quantityInStock = await Quantity.findById(quantityId);
      console.log(quantityInStock);
      if (!quantityInStock || quantityInStock.quantity <= 0) {
        return resolve({
          status: "ERR",
          message: "The quantity is not defined or out of stock",
        });
      }
      // Tìm hoặc tạo giỏ hàng cho khách hàng
      let cart = await Cart.findOne({ customer: userId });
      let message = "Product added to cart successfully";
      if (!cart) {
        cart = new Cart({
          customer: userId,
          items: [
            {
              quantityId: quantityId,
              quantity: Math.min(quantityToAdd, quantityInStock.quantity),
            },
          ],
        });
      } else {
        // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
        const itemIndex = cart.items.findIndex(
          (item) => String(item.quantityId) === String(quantityId)
        );

        if (itemIndex > -1) {
          // Nếu sản phẩm đã tồn tại, cập nhật số lượng
          const currentQuantity = cart.items[itemIndex].quantity;
          const maxQuantityToAdd = Math.min(
            quantityToAdd,
            quantityInStock.quantity - currentQuantity
          );

          if (maxQuantityToAdd > 0) {
            cart.items[itemIndex].quantity += maxQuantityToAdd;
            if (cart.items[itemIndex].quantity === quantityInStock.quantity) {
              message = "Product quantity has reached the stock limit";
            }
          } else {
            cart.items[itemIndex].quantity = quantityInStock.quantity;
            message = "Requested quantity exceeds stock limit";
          }
        } else {
          // Thêm mới sản phẩm vào giỏ hàng
          const limitedQuantityToAdd = Math.min(
            quantityToAdd,
            quantityInStock.quantity
          );
          cart.items.push({
            quantityId: quantityId,
            quantity: limitedQuantityToAdd,
          });
          if (limitedQuantityToAdd === quantityInStock.quantity) {
            message = "Product quantity has reached the stock limit";
          }
        }
      }

      await cart.save();
      resolve({
        status: "OK",
        message: message,
        data: cart,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const viewCart = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm giỏ hàng của người dùng
      const cart = await Cart.findOne({ customer: userId }).populate({
        path: "items.quantity", // Lấy thông tin chi tiết của sản phẩm
        select: "productName price", // Chọn trường cần thiết từ Quantity
      });
      if (!cart) {
        resolve({
          status: "ERR",
          message: "The cart is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "Get cart SUCCESS",
        data: cart,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getQuantityById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const quantityProduct = await Quantity.findById(id);
      // Kiểm tra xem bản ghi có tồn tại không
      if (!quantityProduct) {
        return resolve({
          status: "ERR",
          message: "The quantity product is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "Get quantity successfully",
        data: quantityProduct,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message, // Trả về lỗi nếu có
      });
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  getAll,
  productCountByCategory,
  // fillByMaterial,
  // fillByCategory,
  fillProducts,
  searchProducts,
  getQuantity,
  updateQuantity,
  deleteQuantity,
  getColorById,
  getAllColor,
  createQuantity,
  addProductToCart,
  getQuantityById,
  viewCart,
};
