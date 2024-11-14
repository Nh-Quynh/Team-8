const mongoose = require("mongoose");
const Product = require("../models/ProductModel");
const Customer = require("../models/CustomerModel");
const Category = require("../models/CategoryModel");
const Color = require("../models/ColorModel");
const OrderDetail = require("../models/OrderDetailModel");
const Quantity = require("../models/QuantityModel");
const Material = require("../models/MaterialModel");
const Image = require("../models/ImageModel");
const Cart = require("../models/CartModel");
const DiscountService = require("../services/DiscountService");
const ObjectId = mongoose.Types.ObjectId;

const ObjId = require("mongoose").Types.ObjectId;
//Tao san pham
const createProduct = async (newProduct) => {
  const {
    productId,
    name,
    price,
    description,
    // images,
    categoryId,
    materialId,
    // color,
    // quantity,
  } = newProduct;
  // let products = await Product.find({});

  // // Duyệt qua các sản phẩm và xóa trường images nếu có
  // products.forEach((product) => {
  //   if (product.images) {
  //     delete product.images;
  //   }
  // });

  try {
    // Kiểm tra xem sản phẩm có tồn tại không
    let product = await Product.findOne({ productId });
    if (!product) {
      product = await Product.findOne({ name });
    }
    let categoryObj = await Category.findOne({ _id: categoryId });
    // let colorObj = await Color.findOne({
    //   name: { $regex: new RegExp(`^${color}$`, "i") },
    // });
    // let colorObj = await Color.findOne({ name: color });
    let materialObj = await Material.findOne({ _id: materialId });
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

    // if (!colorObj) colorObj = await Color.create({ name: color });

    // Nếu sản phẩm đã tồn tại
    if (product) {
      // let existingQuantity = await Quantity.findOne({
      //   product: product._id,
      //   color: colorObj._id,
      // });

      // if (existingQuantity) {
      //   // Cập nhật số lượng sản phẩm
      //   existingQuantity.quantity =
      //     Number(existingQuantity.quantity) + Number(quantity);
      //   // existingQuantity.quantity += quantity
      //   await existingQuantity.save();
      //   return {
      //     status: "OK",
      //     message: "Updated existing product quantity",
      //     product,
      //     updateQuantity: existingQuantity,
      //   };
      // } else {
      //   // Tạo mới quantity cho sản phẩm
      //   const newQuantity = await Quantity.create({
      //     product: product._id,
      //     color: colorObj._id,
      //     quantity,
      //   });
      return {
        status: "ERR",
        message: "Created new quantity for existing product",
        product,
        // quantity: newQuantity,
      };
      // }
    }

    // Nếu sản phẩm chưa tồn tại, tiến hành tạo sản phẩm mới
    // const imageIds = [];
    // for (const imageUrl of images) {
    //   const image = await Image.create({ imageUrl });
    //   imageIds.push(image._id); // lưu ObjectId của ảnh vào mảng imageIds
    // }
    product = await Product.create({
      productId,
      name,
      price,
      description,
      category: categoryObj._id,
      material: materialObj._id,
      // images: imageIds,
    });
    // // Tạo mới quantity cho sản phẩm mới
    // const newQuantity = await Quantity.create({
    //   product: product._id,
    //   color: colorObj._id,
    //   quantity,
    // });

    return {
      status: "OK",
      message: "Created new product with quantity",
      product,
      // quantity: newQuantity,
    };
  } catch (e) {
    // In ra lỗi để dễ debug
    console.error("Error in createProduct service:", e);
    throw new Error(e.message);
  }
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm sản phẩm hiện tại trong CSDL
      const product = await Product.findById(id);

      // Nếu không tìm thấy sản phẩm, trả về lỗi
      if (!product) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
        return;
      }

      // Kiểm tra xem tên sản phẩm đã tồn tại chưa
      const existingProduct = await Product.findOne({ name: data.name });
      if (existingProduct && existingProduct._id.toString() !== id) {
        return reject({
          status: "ERR",
          message: "Product with this name already exists. Update failed.",
        });
      }

      // Kiểm tra và cập nhật danh mục và chất liệu
      const categoryObj = await Category.findById(data.categoryId);
      const materialObj = await Material.findById(data.materialId);
      if (!categoryObj) {
        return resolve({
          status: "ERR",
          message: "Unavailable category",
        });
      }
      if (!materialObj) {
        return resolve({
          status: "ERR",
          message: "Unavailable material",
        });
      }

      // Cập nhật hình ảnh
      // const newImageIds = [];
      // for (const imageUrl of data.images) {
      //   // Kiểm tra xem ảnh đã tồn tại hay chưa
      //   const existingImage = product.images.find(
      //     (img) => img.imageUrl === imageUrl
      //   );
      //   if (existingImage) {
      //     newImageIds.push(existingImage._id); // Giữ lại ảnh cũ
      //   } else {
      //     const newImage = await Image.create({ imageUrl }); // Tạo ảnh mới
      //     newImageIds.push(newImage._id); // Thêm ảnh mới vào mảng
      //   }
      // }

      // Xóa ảnh không còn dùng trong `product.images` hiện tại
      // for (const image of product.images) {
      //   if (!newImageIds.includes(image._id)) {
      //     await Image.findByIdAndDelete(image._id); // Xóa ảnh thừa
      //   }
      // }

      // Cập nhật các trường còn lại của sản phẩm
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          ...data,
          category: categoryObj._id,
          material: materialObj._id,
          // images: newImageIds,
        },
        { new: true, runValidators: true }
      );

      // Trả về kết quả thành công
      resolve({
        status: "OK",
        message: "Update product success",
        data: updatedProduct,
      });
    } catch (e) {
      // Xử lý lỗi
      console.error("Error in updateProduct service:", e);
      reject({
        status: "ERR",
        message: e.message,
      });
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ _id: id });

      console.log("Id Service", id);

      if (checkProduct == null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
        return;
      }

      // // Duyệt qua mảng checkProduct.images và xóa từng ảnh
      // if (checkProduct.images && Array.isArray(checkProduct.images)) {
      //   for (const imageId of checkProduct.images) {
      //     await Image.findByIdAndDelete(imageId); // Giả sử delebyId là hàm xóa ảnh
      //   }
      // }

      // Xóa sản phẩm sau khi xóa ảnh thành công
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
      // const responseDissount = await DiscountService.getDiscountByProductId(id);
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

const fillProducts = async (categoryId, materialId) => {
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
        .populate("category");
      const totalProduct = await Product.countDocuments(query);

      resolve({
        status: "OK",
        message: "Get filled products",
        data: products,
        total: totalProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const searchProducts = (keyword) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 'regex' helps in case searching for part of product name
      // options: i helps in case insensitive search
      const products = await Product.find({
        name: { $regex: keyword, $options: "i" },
      });
      const totalProduct = await Product.countDocuments({
        name: { $regex: keyword },
      });

      resolve({
        status: "OK",
        message: "Get filled products",
        data: products,
        total: totalProduct,
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
const updateQuantity = async (id, quantity, images) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm sản phẩm cần cập nhật
      const quantityProduct = await Quantity.findById(id);
      if (!quantityProduct) {
        return resolve({
          status: "ERR",
          message: "The quantity product is not defined",
        });
      }

      // Cập nhật hình ảnh
      const newImageIds = [];
      for (const imageUrl of images) {
        // Sử dụng `images` từ tham số
        // Kiểm tra xem ảnh đã tồn tại hay chưa
        const existingImage = quantityProduct.images.find(
          (img) => img.imageUrl === imageUrl
        );
        if (existingImage) {
          newImageIds.push(existingImage._id); // Giữ lại ảnh cũ
        } else {
          const newImage = await Image.create({ imageUrl }); // Tạo ảnh mới
          newImageIds.push(newImage._id); // Thêm ảnh mới vào mảng
        }
      }

      // Xóa ảnh không còn dùng trong `quantityProduct.images` hiện tại
      for (const image of quantityProduct.images) {
        if (!newImageIds.includes(image._id)) {
          await Image.findByIdAndDelete(image._id); // Xóa ảnh thừa
        }
      }

      // Cập nhật `quantity` và `images` trong `Quantity`
      const updatedProduct = await Quantity.findByIdAndUpdate(
        id,
        {
          quantity: quantity,
          images: newImageIds,
        },
        { new: true }
      );

      resolve({
        status: "OK",
        message: "Quantity updated successfully",
        data: updatedProduct,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message,
      });
    }
  });
};

const createQuantity = (newQuantity) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { color, quantity, images, productId } = newQuantity;
      console.log("tới đây");

      // Kiểm tra tính hợp lệ của productId
      let productObj = await Product.findOne({ _id: productId });
      if (!productObj) {
        return reject({
          status: "ERR",
          message: "Product not found",
        });
      }

      // Tìm hoặc tạo màu
      let colorObj = await Color.findOne({
        name: { $regex: new RegExp(`^${color}$`, "i") },
      });
      if (!colorObj) colorObj = await Color.create({ name: color });

      // Kiểm tra xem quantity cho sản phẩm và màu đã tồn tại chưa
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

      let quantityObj;
      if (images && images.length > 0) {
        // // Duyệt qua mảng images và tạo hình ảnh
        // const imagePromises = images.map((image) => {
        //   return Image.create({
        //     imageUrl: image,
        //   });
        // });

        // // Chờ tất cả các hình ảnh được tạo
        // const createdImages = await Promise.all(imagePromises);

        // // Lưu tất cả các ID của hình ảnh đã tạo vào mảng
        // const imageIds = createdImages.map((image) => image._id);
        const imageIds = [];
        const uniqueImages = [...new Set(images)]; // Loại bỏ ảnh trùng lặp

        for (const imageUrl of uniqueImages) {
          const image = await Image.create({ imageUrl });
          imageIds.push(image._id); // lưu ObjectId của ảnh vào mảng imageIds
        }

        quantityObj = await Quantity.create({
          product: productObj._id,
          color: colorObj._id,
          quantity,
          images: imageIds, // Lưu mảng ID hình ảnh
        });
      } else {
        // Nếu không có hình ảnh, tạo quantity mà không cần image
        quantityObj = await Quantity.create({
          product: productObj._id,
          color: colorObj._id,
          quantity,
        });
      }

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
      const quantity = await Quantity.findById(quantityId);

      // Kiểm tra xem bản ghi có tồn tại không
      if (!quantity) {
        return resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }
      // Duyệt qua mảng checkProduct.images và xóa từng ảnh
      if (quantity.images && Array.isArray(quantity.images)) {
        for (const imageId of quantity.images) {
          await Image.findByIdAndDelete(imageId); // Giả sử delebyId là hàm xóa ảnh
        }
      }
      await Quantity.findByIdAndDelete(quantityId);

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
            if (cart.items[itemIndex].quantity > quantityInStock.quantity) {
              cart.items[itemIndex].quantity = quantityInStock.quantity;
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
const incrementItemProduct = (userId, itemId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const customerObj = await Customer.findById(userId);
      if (!customerObj) {
        return resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      let cart = await Cart.findOne({ customer: userId });
      if (!cart) {
        return resolve({
          status: "ERR",
          message: "The cart is not defined or out of stock",
        });
      }
      // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
      const itemIndex = cart.items.findIndex(
        (item) => String(item._id) === String(itemId)
      );

      if (itemIndex > -1) {
        const quantityObj = await Quantity.findOne({
          _id: cart.items[itemIndex].quantityId,
        });
        console.log(itemIndex);
        console.log("quantityId", cart.items[itemIndex].quantityId);
        const maxAddToCart = quantityObj.quantity;
        const addQuantity = cart.items[itemIndex].quantity + 1;
        if (addQuantity <= maxAddToCart) {
          cart.items[itemIndex].quantity = addQuantity;
        } else {
          return resolve({
            status: "ERR",
            message: "Product quantity has reached the stock limit",
          });
        }
      } else {
        return resolve({
          status: "ERR",
          message: "The item is not defined or out of stock",
        });
      }
      await cart.save();
      resolve({
        status: "OK",
        message: "The product was incremented of item",
        data: cart,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const decrementItemProduct = (userId, itemId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const customerObj = await Customer.findById(userId);
      if (!customerObj) {
        return resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      let cart = await Cart.findOne({ customer: userId });
      if (!cart) {
        return resolve({
          status: "ERR",
          message: "The cart is not defined or out of stock",
        });
      }
      // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
      const itemIndex = cart.items.findIndex(
        (item) => String(item._id) === String(itemId)
      );

      if (itemIndex > -1) {
        const itemDecrement = cart.items[itemIndex].quantity - 1;
        if (itemDecrement > 0) {
          cart.items[itemIndex].quantity = itemDecrement;
        } else {
          await cart.updateOne({ $pull: { items: { _id: itemId } } });
          console.log("da toi day");
          // Cập nhật lại giỏ hàng sau khi xóa
          cart.items.splice(itemIndex, 1); // Xóa item từ mảng items
          // return resolve({
          //   status: "OK",
          //   message: "Item has been removed from the cart",
          //   data: cart,
          // });
        }
      } else {
        return resolve({
          status: "ERR",
          message: "The item is not defined or out of stock",
        });
      }
      await cart.save();
      resolve({
        status: "OK",
        message: "The product was decremented of item",
        data: cart,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteItemProduct = (userId, itemId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const customerObj = await Customer.findById(userId);
      if (!customerObj) {
        return resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      let cart = await Cart.findOne({ customer: userId });
      if (!cart) {
        return resolve({
          status: "ERR",
          message: "The cart is not defined or out of stock",
        });
      }

      // Tìm chỉ mục của mục trong giỏ hàng
      const itemIndex = cart.items.findIndex(
        (item) => item._id.toString() === itemId
      );
      if (itemIndex === -1) {
        return {
          status: "ERR",
          message: "Item not found in the cart",
        };
      }
      // Xóa mục
      await cart.updateOne(
        { customer: userId },
        { $pull: { items: { _id: itemId } } }
      );
      // Cập nhật lại giỏ hàng trong bộ nhớ
      cart.items.splice(itemIndex, 1);
      await cart.save();

      resolve({
        status: "OK",
        message: "The item has removed from the cart",
        data: cart,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const searchProductByAdmin = (keyword) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 'regex' helps in case searching for part of product name
      // options: i helps in case insensitive search
      const products = await Product.find({
        $or: [
          { productId: { $regex: keyword, $options: "i" } },
          { name: { $regex: keyword, $options: "i" } },
        ],
      });
      resolve({
        status: "OK",
        message: "Search product success",
        data: products,
      });
    } catch (e) {
      reject(e);
    }
  });
};
//Thống kê
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
// const topSellingProducts = async () => {
//   try {
//     const topProducts = await OrderDetail.aggregate([
//       {
//         $group: {
//           _id: "$productQuantity", // Nhóm theo productQuantity
//           totalQuantity: { $sum: "$quantity" }, // Tính tổng số lượng bán ra
//         },
//       },
//       {
//         $lookup: {
//           from: "quantities", // Truy cập bảng quantities
//           localField: "_id", // Trường _id ở đây là productQuantity
//           foreignField: "_id", // Trường _id trong bảng quantities
//           as: "quantityDetails",
//         },
//       },
//       {
//         $lookup: {
//           from: "products", // Truy cập bảng products
//           localField: "quantityDetails.product", // Trường product trong quantityDetails
//           foreignField: "_id", // Trường _id trong bảng products
//           as: "productDetails",
//         },
//       },
//       {
//         $unwind: "$productDetails", // Giải nén để lấy từng sản phẩm
//       },
//       {
//         $project: {
//           _id: 0,
//           productIdObj: { $arrayElemAt: ["$quantityDetails.product", 0] },
//           productId: "$productDetails.productId",
//           productName: "$productDetails.name",
//           price: "$productDetails.price",
//           urlImage: "$productDetails.urlImage",
//           totalQuantity: 1, // Tổng số lượng bán ra
//         },
//       },
//       {
//         $sort: { totalQuantity: -1 }, // Sắp xếp theo tổng số lượng bán ra giảm dần
//       },
//       {
//         $limit: 10, // Giới hạn kết quả chỉ lấy 10 sản phẩm hàng đầu
//       },
//     ]);

//     return {
//       status: "OK",
//       message: "Top selling products fetched successfully",
//       data: topProducts,
//     };
//   } catch (error) {
//     console.error("Error fetching top selling products:", error); // Ghi log chi tiết lỗi
//     throw new Error("An error occurred while fetching top selling products");
//   }
// };
const topSellingProducts = async () => {
  try {
    const topProducts = await OrderDetail.aggregate([
      {
        $lookup: {
          from: "quantities", // Truy cập bảng quantities
          localField: "productQuantity", // Trường productQuantity trong OrderDetail
          foreignField: "_id", // Trường _id trong bảng quantities
          as: "quantityDetails",
        },
      },
      {
        $unwind: "$quantityDetails", // Giải nén quantityDetails để truy cập từng phần tử
      },
      {
        $group: {
          _id: "$quantityDetails.product", // Nhóm theo productId từ quantityDetails
          totalQuantity: { $sum: "$quantity" }, // Tính tổng số lượng bán ra
        },
      },
      {
        $lookup: {
          from: "products", // Truy cập bảng products
          localField: "_id", // Trường _id là productId sau khi nhóm
          foreignField: "_id", // Trường _id trong bảng products
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails", // Giải nén để lấy từng sản phẩm
      },
      {
        $project: {
          _id: 0,
          productId: "$productDetails.productId",
          productName: "$productDetails.name",
          price: "$productDetails.price",
          urlImage: "$productDetails.urlImage",
          totalQuantity: 1, // Tổng số lượng bán ra
        },
      },
      {
        $sort: { totalQuantity: -1 }, // Sắp xếp theo tổng số lượng bán ra giảm dần
      },
      {
        $limit: 10, // Giới hạn kết quả chỉ lấy 10 sản phẩm hàng đầu
      },
    ]);

    return {
      status: "OK",
      message: "Top selling products fetched successfully",
      data: topProducts,
    };
  } catch (error) {
    console.error("Error fetching top selling products:", error); // Ghi log chi tiết lỗi
    throw new Error("An error occurred while fetching top selling products");
  }
};
const totalProductsSold = async () => {
  try {
    const totalSold = await OrderDetail.aggregate([
      {
        $group: {
          _id: null, // Không cần nhóm theo product
          totalQuantity: { $sum: "$quantity" }, // Tính tổng quantity trực tiếp từ OrderDetail
        },
      },
    ]);

    const result = totalSold[0]?.totalQuantity || 0; // Đảm bảo kết quả trả về là 0 nếu không có dữ liệu

    return {
      status: "OK",
      message: "Total products sold fetched successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error fetching total products sold:", error);
    throw new Error("An error occurred while fetching total products sold");
  }
};
const lowStockProductsWithColor = async () => {
  try {
    const products = await Quantity.aggregate([
      {
        $match: {
          quantity: { $lte: 5 }, // Bao gồm tất cả sản phẩm có quantity <= 5, bao gồm cả 0 và 1
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: {
          path: "$productDetails",
          preserveNullAndEmptyArrays: true, // Giữ lại các bản ghi không có thông tin trong productDetails
        },
      },
      {
        $lookup: {
          from: "colors",
          localField: "color",
          foreignField: "_id",
          as: "colorDetails",
        },
      },
      {
        $unwind: {
          path: "$colorDetails",
          preserveNullAndEmptyArrays: true, // Giữ lại các bản ghi không có thông tin trong colorDetails
        },
      },
      {
        $project: {
          _id: 0,
          productIdObj: "$product",
          productId: "$productDetails.productId",
          productName: "$productDetails.name",
          colorName: "$colorDetails.name",
          quantityInStock: "$quantity",
        },
      },
      {
        $sort: { quantityInStock: 1 }, // Sắp xếp theo số lượng tồn kho tăng dần
      },
      {
        $limit: 10, // Giới hạn chỉ lấy 10 sản phẩm
      },
    ]);

    console.log("Low stock products:", products);

    return {
      status: "OK",
      message: "Products with low stock and color fetched successfully",
      data: products,
    };
  } catch (error) {
    console.error("Error fetching products with low stock and color:", error);
    throw new Error(
      "An error occurred while fetching products with low stock and color"
    );
  }
};
const getImageById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 'regex' helps in case searching for part of product name
      // options: i helps in case insensitive search
      const image = await Image.findById(id);
      resolve({
        status: "OK",
        message: "Get image success",
        data: image,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const fillProductsByColor = async (colorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm các sản phẩm trong bảng Quantity theo colorId và populate sản phẩm
      const quantities = await Quantity.find({ color: colorId }).populate({
        path: "product",
      });

      // Lấy tất cả các sản phẩm đã được populate và loại bỏ null
      const products = quantities
        .map((quantity) => quantity.product)
        .filter((product) => product !== null);

      const totalProduct = products.length;

      resolve({
        status: "OK",
        message: "Get filled products",
        data: products,
        total: totalProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAll,
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
  incrementItemProduct,
  decrementItemProduct,
  searchProductByAdmin,
  deleteItemProduct,
  productCountByCategory,
  topSellingProducts,
  totalProductsSold,
  lowStockProductsWithColor,
  getImageById,
  fillProductsByColor,
};
